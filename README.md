# Raio-X de Margem

**Kit aberto para encontrar onde um negócio perde dinheiro, mostrar em reais, corrigir e provar o que voltou.**
Primeiro setor completo: **restaurantes no Brasil**.

> Não vende IA. Não vende aplicativo. Vende **menos perda, mais margem, mais controle e mais recorrência.**

## Como usar num cliente (6 passos)

1. **Abra `app/index.html`** no navegador (duplo clique; funciona offline, sem instalar nada).
2. **Preencha com o dono**, com extrato do marketplace e da maquininha abertos. Campo que ele não sabe fica vazio.
3. **Imprima o relatório** (botão *Imprimir relatório / PDF*) e **salve o diagnóstico** (.json) — essa é a base "antes".
4. **Abra a receita** do vazamento de maior prioridade em [`docs/modulos/`](docs/modulos/).
5. **Implante** seguindo o checklist da receita (caminho SaaS pronto ou stack própria).
6. **Meça** todo mês com o critério de "Como vamos medir" do relatório e cobre a recorrência.

Abordagem, roteiro da reunião e preço: [`kit-comercial/`](kit-comercial/).

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `app/` | Raio-X (interface + motor de cálculo) |
| `setores/` | Pacotes de setor: perguntas, fórmulas, % recuperável, como medir, receitas |
| `docs/ANALISE.md` | Análise profunda da tese, com números e fontes |
| `docs/ARQUITETURA.md` | Como o sistema é montado, formato do pacote e roteiro |
| `docs/modulos/` | Receitas: Cardápio Vivo, Ganho e retenção de clientes, Cobrança e pagamentos, Marketing local e comunidade |
| `docs/origem/` | Os dois textos que deram origem ao projeto |
| `kit-comercial/` | Abordagem, objeções, precificação |
| `tests/` | Testes do motor e da interface |

## Os 11 vazamentos do pacote restaurante

Marketplace cobrando de novo por cliente que já é seu · taxas de cartão · antecipação e conciliação · juros e multas · clientes que não voltam · ticket médio baixo · desperdício · compras sem cotação · cardápio vendendo o que dá menos lucro · equipe presa em tarefa repetitiva · anúncio pagando por quem já é cliente.

## Testes

```bash
npm test                       # motor: exemplos dos documentos de origem (R$ 3.000 e R$ 14.700)
NODE_PATH=<pasta>/node_modules npm run test:ui   # interface em file://, desktop e celular (precisa de playwright)
```

## Outro setor ou outro país

Copie `setores/restaurante.js`, troque `id`, `mercado` e os dados. Outro idioma é outro **mercado**: espanhol = América Latina, inglês = modelo global — cada um com plataformas, pagamentos e referências próprias. Ver [ARQUITETURA.md](docs/ARQUITETURA.md#mercados).

## Privacidade

Nada sai do navegador. Os números do cliente ficam no rascunho local e no `.json` que você salvar.

---

Projeto aberto do [INEMA.CLUB](https://inema.club) · versão 0.1.0
