# Arquitetura — o sistema padrão

O objetivo é que **qualquer implantador** (freelancer, agência pequena, consultor) pegue o repositório e aplique num cliente sem programar. O sistema tem **uma ferramenta por etapa da venda**, todas alimentadas pelo mesmo **pacote de setor**.

```
            ┌──────────────────────── pacote de setor (dados) ────────────────────────┐
            │ perguntas · fórmulas dos vazamentos · % recuperável · como medir ·      │
            │ receitas · critérios de lead · referências do mercado                   │
            └───────┬───────────────┬────────────────┬───────────────────┬────────────┘
                    ▼               ▼                ▼                   ▼
 1. PROSPECTAR  Caçador de     2. DIAGNOSTICAR  3. CORRIGIR         4. MEDIR / COBRAR
                Margem            Raio-X           Receitas            Painel de
                (lista de leads   (R$/mês por      (módulos de         Recuperação
                 pontuada)         vazamento)       correção)           (antes × depois)
                    │                   │                │                   │
                    └──── abordagem ────┴── proposta ────┴── implantação ────┴── recorrência
```

## Estado atual (v0.2.0)

| Peça | Estado | Onde |
|---|---|---|
| Pacote de setor restaurante (BR) | ✅ pronto, testado | `setores/restaurante.js` |
| Motor de cálculo | ✅ pronto, 7 testes | `app/motor.js`, `tests/motor.test.js` |
| Raio-X (interface + relatório PDF) | ✅ pronto, testado em `file://` desktop e celular | `app/index.html` |
| Caçador de Margem (tela + coletor de fontes abertas) | ✅ pronto, testado; piloto Batel/Curitiba | `app/cacador.html`, `coletor/` |
| Receitas (módulos de correção) | 📄 especificados (5, inclui 100% canal próprio) | `docs/modulos/` |
| Kit comercial | 📄 abordagem + preço (falta proposta modelo, contrato, termo LGPD) | `kit-comercial/` |
| Termos de uso e alternativas abertas | 📄 lidos na íntegra / verificados | `docs/TERMOS.md`, `docs/ALTERNATIVAS-ABERTAS.md` |
| Painel de Recuperação | ✅ pronto, testado (antes × depois, meta, acumulado, bônus atribuível) | `app/painel.html`, `app/painel-motor.js` |
| Outros setores / mercados | 🔜 | fase 6 |
| Guia trilíngue (GitHub Pages) | 🔜 | fase 7 |

## Princípios

1. **Abre sem instalar.** HTML + JS puro, sem build, sem servidor, sem CDN. Funciona em `file://`, pendrive, GitHub Pages.
2. **Dados do cliente ficam com o implantador.** Rascunho no navegador (`localStorage`) e arquivo `.json` salvo à mão. Nada sai da máquina. Bom para LGPD e para confiança do dono.
3. **Pacote de setor é dado, não código.** Novo setor = novo arquivo. O motor não muda.
4. **Todo número tem dono.** Referência de mercado traz `fonte.verificado`; premissa aparece no relatório como premissa.
5. **Medir é parte do produto.** Todo vazamento declara como medir antes de ser corrigido.

## Pacote de setor — formato

Arquivo `setores/<id>[.<mercado>].js` que se registra em `window.RXM_SETORES` (por isso `.js` e não `.json`: `fetch` não funciona em `file://`).

```js
{
  id, nome, versao, mercado: 'BR' | 'LATAM' | 'GLOBAL', idioma, moeda,
  grupos:   [{ id, titulo }],
  entradas: [{ id, grupo, rotulo, unidade: 'R$'|'%'|'un'|'h'|'p.p.', exemplo, ajuda? }],
  vazamentos: [{
    id, nome, explicacao,
    entradas: ['id', ...],          // variáveis usadas na fórmula
    formula: 'expressão JS',        // perda mensal em moeda; negativo vira 0
    recuperavel_pct, dificuldade: 1..5, prazo_semanas,
    como_medir: { base, metrica, janela },
    receitas: ['id-da-receita'],
    fonte: { texto, verificado: bool }
  }],
  receitas: { 'id': { nome, doc, resumo } },
  cacador:  { criterios: [{ id, rotulo, peso }], abordagem }   // pesos somam 100
}
```

**Segurança:** a `formula` é avaliada com `new Function`. Pacotes são arquivos confiáveis do próprio implantador — não carregar pacote de terceiros sem ler.

**Prioridade** (ordem do relatório) = recuperável ÷ dificuldade, acelerada quando o prazo até o 1º efeito é curto. Ideia: começar pelo que paga a implantação rápido.

**Teste obrigatório para pacote novo:** `tests/motor.test.js` tem o teste de integridade (entradas existem, receitas existem, pesos somam 100, todo vazamento tem `como_medir` e `fonte.verificado`). Copie o bloco para o novo pacote e acrescente pelo menos um caso numérico conferido à mão.

## Módulos de correção (receitas)

Cada receita ataca vazamentos específicos e tem **dois caminhos**: SaaS pronto (rápido, barato, quase sempre o certo) ou stack própria (quando o cliente quer controle ou o SaaS não cobre).

| Receita | Ataca | Doc |
|---|---|---|
| **Cardápio Vivo** | marketplace, ticket, cardápio, mão de obra | [modulos/cardapio-vivo.md](modulos/cardapio-vivo.md) |
| **Ganho e retenção de clientes** | marketplace, retenção, marketing | [modulos/aquisicao.md](modulos/aquisicao.md) |
| **Cobrança e pagamentos** | pagamentos, antecipação, caixa | [modulos/cobranca.md](modulos/cobranca.md) |
| **Marketing local e comunidade** | retenção, marketplace, marketing | [modulos/marketing-local.md](modulos/marketing-local.md) |
| **100% canal próprio** | marketplace (inteiro), pagamentos | [modulos/canal-proprio.md](modulos/canal-proprio.md) |

Desperdício e compras ficam como **processo interno** (ficha técnica, pesagem, cotação) — o kit diagnostica e mede, mas a correção é de gestão, não de software.

## Mercados

Outro idioma **não é tradução: é outro mercado.**

| Versão | Público | O que muda no pacote |
|---|---|---|
| PT (BR) | Brasil | iFood/99Food/Keeta/Rappi, Pix, MDR BR, WhatsApp |
| ES (LATAM) | América Latina hispânica | Rappi, PedidosYa, DiDi Food, Uber Eats; Mercado Pago e pagamentos instantâneos locais; WhatsApp central; moeda por país |
| EN (GLOBAL) | modelo mundial, sem foco no Brasil | Uber Eats, DoorDash, Deliveroo, Just Eat; cartão/carteiras digitais; canal próprio via SMS/e-mail/app/WhatsApp conforme o país; moeda configurável |

Cada mercado: pacote `setores/restaurante.latam.js` / `restaurante.global.js`, com pesquisa própria de referências (em `docs/ANALISE.<mercado>.md`), exemplos e textos da interface no idioma. Os exemplos nunca citam iFood/Pix fora do pacote BR.

## Roteiro

| Fase | Entrega | Pronto quando |
|---|---|---|
| 1 | Repo, docs de origem, análise, arquitetura | ✅ |
| 2 | Raio-X restaurante | ✅ testes de motor + UI em `file://` |
| 3 | Caçador de Margem: coletor (CNPJ + OSM + site + IA pela assinatura) → pontuação, potencial, abordagem, andamento | ✅ piloto Batel/Curitiba |
| 4 | Receitas com checklist de implantação passo a passo e SaaS comparados | um implantador novo segue sem perguntar |
| 5 | Painel de Recuperação: abre o `.json` do diagnóstico, recebe números do mês, mostra antes × depois | ✅ testes com conta à mão (cartão renegociado, recompra migrada, piora, acumulado, bônus) |
| 6 | Pacotes: hotel, clínica, salão; mercados LATAM e GLOBAL | testes de integridade + 1 caso numérico por pacote |
| 7 | Guia trilíngue em `guia/` (GitHub Pages) + card no portal | página no ar |
