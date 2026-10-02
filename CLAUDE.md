# CLAUDE.md — raio-x-margem

Kit aberto: diagnóstico de vazamentos de dinheiro (Raio-X) + receitas de correção + medição. Restaurante BR é o 1º pacote.

- Repo: `inematds/raio-x-margem`. Autor de commit: `inematds <inematds@gmail.com>` (config local do repo).
- Sem build, sem servidor, sem CDN: `app/index.html` tem de abrir em `file://`. Pacotes de setor são `.js` que se registram em `window.RXM_SETORES` (fetch de JSON não funciona em file://).
- Pacote de setor é dado; o motor (`app/motor.js`) não deve ganhar regra específica de setor.
- Todo número de referência leva `fonte.verificado`; número sem fonte é premissa, nunca fato. Fontes em `docs/ANALISE.md`.
- Vazamento em **margem**, não faturamento, quando envolve venda perdida.
- **Outros idiomas = outros mercados:** ES = América Latina, EN = modelo global; nenhum dos dois focado no Brasil. Pacote e análise próprios por mercado (`restaurante.latam.js`, `restaurante.global.js`), sem citar iFood/Pix fora do pacote BR.
- Testes: `npm test` (motor) e `npm run test:ui` com `NODE_PATH` apontando para um `node_modules` com playwright. Rodar os dois antes de push.
- Versão em `VERSION`, `package.json` e `RXM.VERSAO` (motor.js) — mudar juntos (semver do CLAUDE global: minor carrega o patch).
- Nenhuma API paga (Google Places, WhatsApp, etc.) sem autorização explícita.

## Self-learning

When I correct you, or you catch yourself making a mistake: before continuing, add the lesson as a one-line rule under ## Lessons, so it never happens again.

## Lessons

- Teste de UI que gera PDF com `emulateMedia('print')` precisa voltar para `screen` antes de clicar em botões escondidos no print. (01/10/2026)
- `Intl.NumberFormat` em BRL usa espaço não separável ("R$ 0"): normalizar `\s` antes de comparar texto. (01/10/2026)
- Não editar um script bash enquanto ele roda (o bash lê o arquivo aos poucos): copiar para um novo nome ou esperar terminar. Editei `scripts/adaptar-docs.sh` com a adaptação EN em andamento. (02/10/2026)
- CNES: a "esfera administrativa" é de GESTÃO do cadastro, não de propriedade — filtrar empresa pela natureza jurídica (1º dígito 2). Filtrei pela esfera e saíram 0 leads. (02/10/2026)
- Pacotes de outros idiomas não citam o Brasil (Pix, iFood, LGPD) nem como contraste: o prompt de adaptação precisa proibir explicitamente, não só dizer "não existe Pix". (02/10/2026)
- Nas telas, `t` é a função de tradução: nunca usar `t` como nome de parâmetro/variável (o `arq.text().then(function (t)` escondeu a função e quebrou a importação em todos os idiomas). (02/10/2026)
