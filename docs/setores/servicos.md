# Serviços com agenda — clínicas, salões e afins

> Modelo padrão para negócio de hora marcada e cliente que volta. Pacote base [`setores/servicos.js`](../../setores/servicos.js); perfis [`clinica.js`](../../setores/clinica.js) e [`salao.js`](../../setores/salao.js), que herdam da base ([`_herdar.js`](../../setores/_herdar.js)). Pesquisa completa com trechos e links: [servicos-pesquisa-2026-10.md](servicos-pesquisa-2026-10.md) (02/10/2026).

## A tese muda neste setor

O intermediário **quase não pesa no Brasil**: Doctoralia, BoaConsulta, Booksy, Trinks e AppBarber cobram **mensalidade**, não comissão por agendamento (o Booksy isentou no Brasil o Boost, que nos EUA cobra 30% do 1º atendimento). O dinheiro vaza em:

| Perfil | Vazamento nº 1 | Nº 2 | Também |
|---|---|---|---|
| Clínica / consultório | **falta sem aviso** — bem gerida 5–12%, média citada ~25% (fornecedor) | paciente que não volta para retorno/revisão | tratamento indicado não iniciado, glosa de convênio, recepção confirmando à mão |
| Salão / barbearia | **cliente que não volta no ciclo** (barbearia 2–4 semanas; convite 7–20 dias) | falta (EUA: 14% barbearia, 17% salão — fornecedor) | sem clube/assinatura, produto para casa não oferecido |

Evidência de que lembrete funciona: no SUS do Ceará, lembrete por WhatsApp no agendamento, 10 dias e 48 h antes reduziu as faltas em ~19% relativos (ago–nov, 2024→2025; oficial, lido indiretamente).

Assinatura de software **sem uso** é outro vazamento comum (plano anual com permanência, recursos pagos e não ligados): o Raio-X pergunta, o implantador compara "o que paga" com "o que usa".

## Regras de conselho — o que a campanha NÃO pode fazer

| Profissão | Pode | Não pode | Fonte |
|---|---|---|---|
| **Médico** | informar valores e formas de pagamento; desconto em campanha | venda casada ou premiação na promoção, consórcio, prometer resultado, "melhor médico", antes-e-depois que não seja educativo e equilibrado | CFM Res. 2.336/2023, arts. 9º, 11, 14 |
| **Dentista** | dar desconto (o CFO não pode punir — CADE, NT 14/2025; Res. CFO-271/2025); imagem de diagnóstico e resultado final com consentimento | **anúncio com preço ou parcelamento**, brinde, prêmio, sorteio, **gratificação por indicação** (sem "indique e ganhe"), consulta gratuita, telemarketing ativo, imagens do transcurso | CFO 118/2012 arts. 20 e 44; 196/2019; 271/2025 |
| **Fisioterapeuta** | — | preço fora do local de atendimento, promoção, valor abaixo do Referencial, depoimento de paciente | COFFITO 424/2013, arts. 10, 39, 40 |
| **Esteticista** (não médica) | — (sem conselho; vale o CDC) | — | Lei 13.643/2018 |

**Consequência para o kit:** em clínica, as receitas usam **serviço** (confirmação, lembrete de retorno, retorno de orçamento, lista de espera) e não promoção. O Caçador mostra alerta em odontologia e fisioterapia.

## LGPD

- **Clínica:** dado de saúde é **sensível** (art. 5º II; art. 11). Legítimo interesse **não** serve (exemplo 1 do guia da ANPD, fev/2024). Lembrete de consulta marcada e de retorno clínico pode se apoiar em **tutela da saúde** (art. 11, II, f) — *interpretação, não texto da ANPD*. Campanha comercial exige **consentimento específico e destacado**. Nunca compartilhar base de pacientes com parceiro (art. 11 §4º).
- **Salão:** dado comum; convite de retorno por legítimo interesse com opção de sair. Cuidado: anamnese e foto de procedimento estético podem virar dado de saúde.
- **Plataformas:** na Doctoralia o profissional é o controlador dos dados e precisa de base legal para comunicações; não achamos cláusula que proíba convidar o paciente a agendar direto. Trinks: cliente "balcão" é do estabelecimento.

## Fontes de leads

| Fonte | Cobre | Observação |
|---|---|---|
| **CNES** (Ministério da Saúde, dados abertos) | clínicas e consultórios com CNPJ, bairro, telefone, tipo de unidade | [`coletor/cnes.py`](../../coletor/cnes.py); filtrar ativos e **natureza jurídica de empresa** (a "esfera" do CNES é de gestão, não de propriedade). Batel: 318 empresas ativas (174 consultórios, 81 clínicas, 63 policlínicas) |
| CNPJ (Receita) | todos os CNAEs, inclusive salões (CNES não cobre beleza) | grupo `servicos` no [`coletor/cnpj.py`](../../coletor/cnpj.py) |
| OpenStreetMap | pouco: 7 lugares no Batel | `--setor servicos` |

CNAEs: médica 8630-5/01, /02, /03; odontologia 8630-5/04, /05; outras ambulatoriais 8630-5/99; nutrição 8650-0/02; psicologia 8650-0/03; fisioterapia 8650-0/04; fonoaudiologia 8650-0/06; práticas integrativas 8690-9/01; acupuntura 8690-9/03; podologia 8690-9/04; outras 8690-9/99; cabeleireiros, manicure e pedicure 9602-5/01; estética 9602-5/02; clínicas de estética 9609-2/01.

## Custos de software (mensal, fornecedor, 02/10/2026)

Doctoralia R$ 429–679 (plano anual com permanência) · BoaConsulta a partir de R$ 67/profissional · Feegow R$ 129–249/profissional · iClinic R$ 99–129 · Clinicorp R$ 159,90–369,90 · Simples Dental R$ 137–321 · Booksy R$ 99,99 (+R$ 20/agenda) · Trinks R$ 76–110 (1–2 profissionais) · AppBarber R$ 79,90–164,50.

## Não confirmado

Glosa de clínica/odonto (só há dado de hospital); % de clientes que não voltam no Brasil; faltas em salão no Brasil; taxa de pagamento da Doctoralia; preços de Avec, Belasis, Salão99, Amplimed, Ninsaúde; termos completos do Booksy Brasil.
