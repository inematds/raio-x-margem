# Coletor de leads

Monta a lista de restaurantes de um bairro com **fontes abertas** e entrega um `leads.json` para importar no Caçador (`app/cacador.html`). Roda na máquina de quem implanta; Python 3 e Node, sem dependências extras.

## Passo a passo (exemplo: Batel, Curitiba)

```bash
# 1. Empresas ativas de alimentação no bairro — dados abertos do CNPJ (Receita)
#    1ª vez por município baixa ~7 GB filtrando no caminho (não grava os zips; ~50 min a 2 MB/s)
python3 coletor/cnpj.py --uf PR --municipio 7535 --cidade Curitiba --bairro BATEL --saida dados/cnpj-batel.json

# 2. Lugares no OpenStreetMap (traz site/telefone quando a comunidade cadastrou)
python3 coletor/osm.py --cidade Curitiba --bairro Batel --saida dados/osm-batel.json

# 3. Juntar sem duplicar (mesmo CNPJ ou nome parecido no mesmo bairro)
node coletor/juntar.js dados/cnpj-batel.json dados/osm-batel.json > dados/leads-batel.json

# 4. Enriquecer: site do próprio restaurante + sinais
python3 coletor/sitios.py --entrada dados/leads-batel.json --saida dados/leads-batel-enriquecidos.json --limite 30
#    opcional: achar site/Instagram de quem não tem (Firecrawl, ~2 créditos por busca)
#      --buscar firecrawl --max-buscas 30            → mostra a estimativa
#      --buscar firecrawl --max-buscas 30 --confirmar → gasta
#    opcional: IA pela assinatura revisa os sinais:  --ia claude   (ou --ia codex)

# 5. Abrir app/cacador.html → "Importar leads" → dados/leads-batel-enriquecidos.json
```

## O que cada fonte traz

| Fonte | Traz | Não traz |
|---|---|---|
| CNPJ (Receita) | todo CNPJ ativo do bairro, CNAE, porte (ME/EPP/MEI), abertura, telefone comercial, endereço | site, nota, avaliações |
| OpenStreetMap | nome de fachada, tipo (restaurante/bar/café), às vezes site e telefone | porte, avaliações |
| Site do restaurante | pedido online próprio, WhatsApp, fidelidade, links para marketplace e Instagram | nota, avaliações |
| Busca (Firecrawl, opcional) | site oficial, perfil do Instagram, presença em marketplace (para conferir) | — |
| **Você, à mão** | **nota e nº de avaliações no Google, Instagram ativo, confirmação do marketplace** | — |

Nota e avaliações do Google ficam para conferência manual: raspar o Google Maps viola os termos ([docs/TERMOS.md](../docs/TERMOS.md)). O Caçador abre a busca pronta para cada lead.

## Regras

- **Só dados da empresa.** O coletor não guarda e-mail, razão social de MEI (costuma ter nome e CPF) nem dados de avaliadores (LGPD).
- **robots.txt respeitado** na leitura de sites; 1 consulta por vez no Overpass.
- **Crédito pago só com `--confirmar`.** Sem ele, o script mostra quantas buscas novas faria e o custo estimado.
- Tudo em `dados/` fica fora do git (cache incluso).

## Código do município

É o da **Receita**, não o do IBGE. Curitiba = `7535`. Outros: abrir `Municipios.zip` no compartilhamento da Receita (o `cnpj.py` usa o mês mais recente). O texto do bairro é como a Receita grava (maiúsculas, sem acento): `BATEL`, `AGUA VERDE`, `CENTRO`.

## Armadilhas (vistas no piloto)

- **Razão social no lugar do nome de fachada.** Sem nome fantasia, o CNPJ traz "Aakf Lanchonete e Cafeteria Ltda" — ninguém busca o restaurante assim. Priorize leads que também aparecem no OpenStreetMap ou com nome fantasia; o resto, confira o nome de fachada à mão antes de buscar.
- **Grande ≠ bom lead.** Porte DEMAIS no Batel inclui franquias e redes (Madero, Bacio di Latte, Hard Rock): a decisão de canal é da franqueadora. No hotel, acima de ~200 UHs costuma ser rede com central própria.
- **Hotel médio já tem motor de reserva.** No piloto de Gramado/Canela (48–118 UHs), 33 de 40 já tinham motor (quase todos Omnibees). Para esses, o vazamento é a fatia que ainda vai pela OTA, a baixa temporada e o hóspede que não volta — não "falta canal".
- **Bairro na Receita é texto livre.** O filtro compara o texto depois de normalizar acento e espaço; grafias diferentes do mesmo bairro ficam de fora. Antes de fechar a lista, abra o cache do município (`dados/cnpj-*-<grupo>.csv`) e confira as variações.
