#!/usr/bin/env python3
"""Servidor LOCAL da tela Coletar: serve o app e roda o coletor/rodar.sh em segundo plano.

Uso:
  python3 coletor/servidor.py              → http://127.0.0.1:8790/app/coletar.html
  python3 coletor/servidor.py --porta 8791

Só escuta em 127.0.0.1 (nunca na rede). Um coleta por vez (Overpass e Firecrawl não
gostam de rajada). Os campos são validados e o comando é montado como lista de
argumentos — nada passa por shell.
"""
import argparse
import http.server
import json
import os
import re
import socket
import subprocess
import threading
import time
import uuid

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SETORES = {"restaurante", "hotel", "clinica", "salao"}
IAS = {"nenhuma", "claude", "codex"}
TEXTO = re.compile(r"^[^\W\d_][\w\s\-'.]{0,59}$", re.UNICODE)  # letras, espaço, hífen, apóstrofo, ponto
TRABALHOS = {}
TRAVA = threading.Lock()


class ErroDeEntrada(ValueError):
    pass


def construir_comando(d):
    """Valida o pedido da tela e devolve a lista de argumentos do rodar.sh."""
    setor = d.get("setor")
    uf = str(d.get("uf", "")).upper()
    cidade = str(d.get("cidade", "")).strip()
    bairro = str(d.get("bairro", "") or "").strip()
    ia = d.get("ia", "nenhuma")
    if setor not in SETORES:
        raise ErroDeEntrada("setor inválido")
    if not re.fullmatch(r"[A-Z]{2}", uf):
        raise ErroDeEntrada("UF inválida")
    if not TEXTO.fullmatch(cidade):
        raise ErroDeEntrada("cidade inválida")
    if bairro and not TEXTO.fullmatch(bairro):
        raise ErroDeEntrada("bairro inválido")
    if ia not in IAS:
        raise ErroDeEntrada("IA inválida")
    try:
        limite = int(d.get("limite", 30))
        buscar = int(d.get("buscar", 0))
    except (TypeError, ValueError):
        raise ErroDeEntrada("limite/buscas devem ser números")
    if not 0 <= limite <= 500 or not 0 <= buscar <= 200:
        raise ErroDeEntrada("limite 0–500 e buscas 0–200")
    cmd = ["bash", "coletor/rodar.sh", "--setor", setor, "--uf", uf, "--cidade", cidade, "--limite", str(limite), "--ia", ia]
    if bairro:
        cmd += ["--bairro", bairro]
    if buscar:
        cmd += ["--buscar", str(buscar)]
        if d.get("confirmar") is True:
            cmd += ["--confirmar"]
    if d.get("simular") is True:
        cmd += ["--simular"]
    return cmd


def iniciar(cmd):
    with TRAVA:
        if any(t["status"] == "rodando" for t in TRABALHOS.values()):
            return None
        tid = uuid.uuid4().hex[:10]
        os.makedirs(os.path.join(RAIZ, "dados", "trabalhos"), exist_ok=True)
        log = os.path.join(RAIZ, "dados", "trabalhos", tid + ".log")
        f = open(log, "w", encoding="utf-8")
        p = subprocess.Popen(cmd, cwd=RAIZ, stdout=f, stderr=subprocess.STDOUT)
        TRABALHOS[tid] = {"status": "rodando", "log": log, "proc": p, "inicio": time.time(), "cmd": cmd}

    def esperar():
        code = p.wait()
        f.close()
        TRABALHOS[tid]["status"] = "ok" if code == 0 else "erro"
        TRABALHOS[tid]["codigo"] = code
    threading.Thread(target=esperar, daemon=True).start()
    return tid


def estado(tid):
    t = TRABALHOS.get(tid)
    if not t:
        return None
    with open(t["log"], encoding="utf-8", errors="replace") as f:
        linhas = f.read().splitlines()
    passo = max([int(m.group(1)) for l in linhas for m in [re.match(r"== \[(\d)/6\]", l)] if m] or [0])
    saida = next((l.split("SAIDA:", 1)[1].strip() for l in reversed(linhas) if l.startswith("SAIDA:")), None)
    return {"id": tid, "status": t["status"], "passo": passo, "log": linhas[-80:], "saida": saida,
            "segundos": int(time.time() - t["inicio"]), "comando": " ".join(t["cmd"][1:])}


class Tratador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def log_message(self, fmt, *args):  # silencioso, exceto erros
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(fmt, *args)

    def _json(self, codigo, obj):
        corpo = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def do_GET(self):
        if self.path == "/api/status":
            return self._json(200, {"ok": True, "versao": open(os.path.join(RAIZ, "VERSION")).read().strip()})
        m = re.fullmatch(r"/api/trabalhos/([0-9a-f]{10})", self.path)
        if m:
            e = estado(m.group(1))
            return self._json(200, e) if e else self._json(404, {"erro": "trabalho não encontrado"})
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/coletar":
            return self._json(404, {"erro": "rota não encontrada"})
        try:
            n = int(self.headers.get("Content-Length", "0"))
            if n > 10000:
                raise ErroDeEntrada("pedido grande demais")
            cmd = construir_comando(json.loads(self.rfile.read(n) or b"{}"))
        except (ErroDeEntrada, json.JSONDecodeError) as e:
            return self._json(400, {"erro": str(e)})
        tid = iniciar(cmd)
        if not tid:
            return self._json(409, {"erro": "já há uma coleta rodando; espere terminar"})
        return self._json(202, {"id": tid, "comando": " ".join(cmd[1:])})


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--porta", type=int, default=8790)
    a = ap.parse_args()
    with socket.socket() as s:
        if s.connect_ex(("127.0.0.1", a.porta)) == 0:
            raise SystemExit(f"A porta {a.porta} já está em uso. Use --porta com outra (ex.: {a.porta + 1}).")
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", a.porta), Tratador)
    print(f"Raio-X de Margem — coletor local em http://127.0.0.1:{a.porta}/app/coletar.html  (Ctrl+C para sair)", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
