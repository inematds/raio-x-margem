"""Testes do coletor sem rede. Rodar: python3 -m unittest discover -s tests -p 'test_*.py'"""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "coletor"))
import sitios  # noqa: E402


def pagina(links, texto):
    return {"url": "https://casa.com.br/", "links": links, "texto": texto}


class Regras(unittest.TestCase):
    def test_whatsapp_sem_pedido_e_ifood(self):
        s, ev, insta = sitios.regras([pagina(
            ["https://wa.me/5541999999999", "https://www.ifood.com.br/delivery/curitiba-pr/casa", "https://instagram.com/casabatel"],
            "Cozinha italiana no Batel. Reservas pelo telefone.")])
        self.assertTrue(s["marketplace"])
        self.assertFalse(s["pedido_proprio"])
        self.assertTrue(s["whatsapp_manual"])
        self.assertFalse(s["fidelidade"])
        self.assertEqual(insta, "casabatel")
        self.assertIn("iFood", ev["marketplace"])

    def test_pedido_proprio_por_saas_e_fidelidade(self):
        s, ev, _ = sitios.regras([pagina(
            ["https://pedido.anota.ai/loja/casa", "https://wa.me/55419"],
            "Peça online! Participe do nosso programa de fidelidade e ganhe cashback.")])
        self.assertTrue(s["pedido_proprio"])
        self.assertFalse(s["whatsapp_manual"])
        self.assertTrue(s["fidelidade"])
        self.assertNotIn("marketplace", s)

    def test_instagram_de_post_nao_vira_perfil(self):
        _, _, insta = sitios.regras([pagina(["https://www.instagram.com/p/ABC123/"], "")])
        self.assertIsNone(insta)


class Busca(unittest.TestCase):
    def test_classifica_site_instagram_marketplace(self):
        lead = {"nome": "Porcini Trattoria", "bairro": "Batel", "cidade": "Curitiba"}
        res = [
            {"url": "https://www.tripadvisor.com.br/Restaurant_Review-porcini"},
            {"url": "https://www.instagram.com/porcinitrattoria/"},
            {"url": "https://www.ifood.com.br/delivery/curitiba-pr/porcini-trattoria-batel/abc"},
            {"url": "https://porcinitrattoria.com.br/cardapio"},
            {"url": "https://outrosite.com.br/"},
        ]
        a = sitios.classificar_resultados(lead, res)
        self.assertEqual(a["site"], "https://porcinitrattoria.com.br/")
        self.assertEqual(a["instagram"], "@porcinitrattoria")
        self.assertEqual(a["marketplaces"][0][0], "iFood")

    def test_dominio_sem_relacao_nao_vira_site(self):
        a = sitios.classificar_resultados({"nome": "Bar do Toninho"}, [{"url": "https://guiacuritiba.com.br/bares"}])
        self.assertIsNone(a["site"])

    def test_consulta(self):
        self.assertEqual(sitios.consulta_de({"nome": "X", "bairro": "Batel", "cidade": "Curitiba"}), "X Batel Curitiba")


if __name__ == "__main__":
    unittest.main()
