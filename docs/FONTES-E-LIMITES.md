# Fontes e limites — o que daria para raspar, por que não e o que fazer no lugar

> Tecnicamente, dá para raspar quase tudo: existem ferramentas abertas prontas para Google Maps, Instagram e apps (ver [ALTERNATIVAS-ABERTAS.md](ALTERNATIVAS-ABERTAS.md)). O kit **não faz isso de propósito**: os termos de uso proíbem, o risco cai em quem implanta e, pior, no cliente. Abaixo, fonte por fonte: o que ela traria, o que impede, o risco e **como conseguir a mesma informação de outro jeito**. Trechos literais e links em [TERMOS.md](TERMOS.md).

## A regra de bolso

Na ordem de preferência:

1. **Dado do próprio dono** — com o cliente na mesa, ele exporta do painel dele (Google, Instagram, iFood, Booking). É o dado mais completo, é dele, e é o que o Raio-X precisa de verdade.
2. **Cadastro público oficial** — CNPJ da Receita, CNES, Cadastur, OpenStreetMap. Aberto, com licença de reuso.
3. **Sinal indireto** — o site do próprio negócio (que linka o app, o Instagram, o motor de reserva) e o resultado de busca web.
4. **API oficial com autorização** — quando existe e quando a escala justifica o custo e a burocracia.
5. **Conferência assistida** — você olha; o Caçador abre a busca pronta e você digita o que viu. Leva ~1 minuto por lead e só vale para os mais bem pontuados.

## Fonte por fonte

### Google Maps — nota, nº de avaliações, telefone, horário, categoria

| | |
|---|---|
| **Traria** | o sinal mais forte de demanda: nota e quantidade de avaliações |
| **O que impede** | Termos do Google Maps Platform 3.2.3 ("will not export, extract, or otherwise scrape Google Maps Content… copy and save business names, addresses, or user reviews"); termos adicionais do Maps §2 (proíbem criar "business listings database, mailing list, or telemarketing list") |
| **Risco** | bloqueio de IP e da conta Google; suspensão do projeto no Google Cloud |
| **Ferramenta que faria** | `gosom/google-maps-scraper` (MIT) — não integrada |
| **No lugar** | (a) **conferência assistida** no Caçador; (b) **Places API oficial**, guardando só o `place_id` e consultando nota/avaliações na hora de exibir (API paga com franquia mensal — exige chave e autorização de uso); (c) com o cliente: **Perfil da Empresa no Google** — o dono exporta insights e avaliações |

### Instagram — perfil, frequência de posts, seguidores

| | |
|---|---|
| **Traria** | se o negócio está ativo e se fala com o cliente |
| **O que impede** | Termos do Instagram ("collecting information in an automated way without our express permission"); Meta Automated Data Collection Terms |
| **Risco** | bloqueio da conta; notificação da Meta (que já processou empresas de raspagem) |
| **Ferramenta que faria** | `instaloader` (MIT) — não integrada |
| **No lugar** | (a) o `sitios.py` pega o **@ no site do próprio negócio**; (b) o Caçador abre o perfil e você marca "post nos últimos 30 dias"; (c) **API oficial da Meta (Business Discovery)** — dados públicos básicos de contas comerciais, exige app Meta, conta comercial própria e revisão; (d) com o cliente: Insights do Instagram dele |

### Apps de delivery — iFood, 99Food, Keeta, Rappi (e no exterior Uber Eats, DoorDash, PedidosYa…)

| | |
|---|---|
| **Traria** | se o restaurante está no app, nota no app, preço e promoções |
| **O que impede** | termos do iFood ao usuário §8 (proibido "coletar… com o intuito de monitorar, classificar dados… ou concorrer", com indenização prevista); termos de cada app |
| **Risco** | bloqueio e ação judicial; para o cliente, problema com o parceiro |
| **No lugar** | (a) **sinal indireto**: o site do restaurante linka o app — o `sitios.py` detecta; (b) a **busca web** (Firecrawl, que respeita robots.txt) mostra a página do restaurante no app — entra como "conferir"; (c) com o cliente: **relatório de vendas e repasse do portal do parceiro** — é ele que dá o custo efetivo que o Raio-X usa |

### Sites de reserva — Booking, Airbnb, Expedia, Tripadvisor

| | |
|---|---|
| **Traria** | presença nas OTAs, nota, preço, disponibilidade |
| **O que impede** | Booking (termos ao cliente A15.2, inclusive "assistentes com tecnologia de IA"), Airbnb 11.1, Tripadvisor |
| **Risco** | bloqueio; conflito com o contrato do hotel |
| **No lugar** | (a) **Cadastur** (aberto): quartos, leitos, site; (b) **site do hotel**: motor de reserva e links para OTAs (`sitios.py`); (c) com o cliente: **extranet da Booking/Airbnb** — reservas por canal e comissões pagas |

## O que o kit coleta sozinho, sem pedir licença a ninguém

| Fonte | Licença | Coletor |
|---|---|---|
| CNPJ (Receita Federal) | dado público | `coletor/cnpj.py` |
| CNES (Ministério da Saúde) | dado aberto | `coletor/cnes.py` |
| Cadastur (Ministério do Turismo) | ODbL | `coletor/cadastur.py` |
| OpenStreetMap | ODbL (atribuição) | `coletor/osm.py` |
| Site do próprio negócio | robots.txt respeitado | `coletor/sitios.py` |
| Busca web (opcional) | Firecrawl, crédito pago, só com `--confirmar` | `coletor/sitios.py --buscar` |

Tudo isso roda por **um comando** (`coletor/rodar.sh`) ou pela **tela Coletar** (`app/coletar.html` com `python3 coletor/servidor.py`).

## LGPD

O coletor guarda **só dados da empresa**: nada de e-mail, CPF, nome de responsável ou de quem avaliou. Consultório de pessoa física fica fora do CNES. Contato de cliente vindo de plataforma nunca é usado.
