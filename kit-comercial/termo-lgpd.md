# Termo LGPD — modelo

> **Modelo para o Brasil, não é parecer jurídico.** Revise com um advogado. Fora do Brasil, a lei de dados de cada país muda bases legais, prazos e direitos — use só como roteiro.
>
> Três partes:
> **A.** Termo de tratamento de dados (Anexo III do [contrato](contrato.md)) — você trata dados dos clientes do seu cliente.
> **B.** Registro de legítimo interesse da sua prospecção — a lista do Caçador.
> **C.** Textos de consentimento que o seu cliente usa com os clientes dele (clube, WhatsApp, clínica).

---

## A. TERMO DE TRATAMENTO DE DADOS PESSOAIS (Anexo III)

Entre **[CONTRATANTE]** ("Controladora") e **[CONTRATADA]** ("Operadora"), integrante do contrato de prestação de serviços de [data].

### 1. Papéis
1.1. Para os dados pessoais dos clientes, pacientes, hóspedes e funcionários da Controladora, a Controladora decide finalidades e meios (**controladora**, LGPD art. 5º, VI) e a Operadora trata os dados em nome dela e segundo suas instruções (**operadora**, art. 5º, VII, e art. 39).
1.2. Os dados de empresas usados na prospecção da Operadora (Parte B) não são objeto deste termo.

### 2. Dados, titulares e finalidades

| Titulares | Dados | Finalidade | Base legal (decisão da Controladora) |
|---|---|---|---|
| Clientes finais | nome, telefone/WhatsApp, e-mail, histórico de pedidos/visitas | operar CRM, régua de retorno, fidelidade, campanhas | consentimento (art. 7º, I) para marketing; execução de contrato (art. 7º, V) para o pedido |
| Hóspedes | nome, contato, datas de estadia | pré-check-in, ofertas de retorno | consentimento coletado pelo próprio hotel — **nunca** o contato fornecido pela plataforma de reserva |
| Pacientes (clínica) | nome, contato, data de retorno — **dado de saúde é sensível** (art. 5º, II) | lembrete de consulta e de retorno | tutela da saúde por profissional/serviço de saúde (art. 11, II, f) para lembretes; **consentimento específico e destacado** (art. 11, I) para qualquer comunicação comercial |
| Funcionários | nome, função, contato | acesso a sistemas | execução de contrato |

2.1. A Operadora **não** usa dados de clientes vindos de marketplaces e plataformas (iFood, Booking, Airbnb etc.) para nenhuma finalidade fora das permitidas pelos contratos da Controladora com essas plataformas.

### 3. Obrigações da Operadora
a) Tratar os dados **só para as finalidades acima** e conforme instruções escritas da Controladora; avisar se uma instrução parecer contrária à lei.
b) Coletar e guardar o **mínimo necessário** (art. 6º, III); não tratar dado de saúde além de nome, contato e data de retorno, salvo instrução expressa.
c) Manter segurança adequada (art. 46): contas com senha forte e verificação em duas etapas, acesso só a quem precisa, sem planilhas de clientes em e-mail ou aplicativos pessoais, sistemas com contas em nome da Controladora.
d) **Suboperadores:** usar só os sistemas aprovados pela Controladora (lista abaixo), preferencialmente contratados em nome dela. Se algum guardar dados fora do Brasil, informar à Controladora (transferência internacional, art. 33).
e) **Incidentes:** comunicar à Controladora qualquer incidente de segurança com dados pessoais **em até 24 horas** do conhecimento, com o que se sabe (dados afetados, titulares, medidas), para que ela avalie a comunicação à ANPD e aos titulares (art. 48; Resolução CD/ANPD nº 15/2024).
f) **Direitos dos titulares** (art. 18): repassar à Controladora, em até 2 dias úteis, pedidos recebidos (acesso, correção, eliminação, revogação de consentimento) e ajudar a atendê-los; **opt-out de campanhas** é atendido de imediato.
g) Manter registro simples das operações que realiza (art. 37).
h) **Fim do contrato:** devolver ou eliminar os dados em até 10 dias, a critério da Controladora, e remover os próprios acessos (art. 16), salvo guarda exigida por lei.

### 4. Obrigações da Controladora
a) Definir as bases legais e coletar os consentimentos necessários (textos da Parte C).
b) Manter o aviso de privacidade do negócio e o canal para os titulares.
c) Informar a Operadora sobre pedidos de titulares e revogações de consentimento.

### 5. Suboperadores aprovados
| Sistema | Uso | Conta em nome de |
|---|---|---|
| [ex.: sistema de cardápio/agenda] | pedidos/agenda | Controladora |
| [ex.: WhatsApp Business / API oficial via provedor] | atendimento e lembretes | Controladora |
| [ex.: planilha/CRM] | base de clientes | Controladora |

### 6. Responsabilidade
A Operadora responde pelos danos que causar ao descumprir este termo ou a LGPD (art. 42, §1º, I).

_____________________________ Controladora · _____________________________ Operadora

---

## B. REGISTRO DE LEGÍTIMO INTERESSE — PROSPECÇÃO (uso interno do consultor)

> O Guia Orientativo da ANPD sobre legítimo interesse (fev/2024) pede um **teste de balanceamento por finalidade**. Preencha uma vez e revise quando mudar a forma de prospectar.

| Item | Resposta |
|---|---|
| **Finalidade** | Oferecer a pequenos negócios um diagnóstico de vazamentos de margem (prospecção B2B). |
| **Dados** | Somente de empresa: nome fantasia, CNPJ, endereço comercial, telefone comercial, site, porte, presença pública (nota, Instagram do negócio). **Não** coleta e-mail, CPF, nome de responsável nem dados de quem avaliou. Consultório de pessoa física fica fora. |
| **Fontes** | Dados públicos oficiais (CNPJ, CNES, Cadastur), OpenStreetMap e o site do próprio negócio — ver [docs/FONTES-E-LIMITES.md](../docs/FONTES-E-LIMITES.md). |
| **Necessidade** (art. 10, §1º) | Só os campos usados para decidir quem abordar e como contatar a empresa. |
| **Legítima expectativa** | Empresa com dados públicos de contato espera receber contato comercial pertinente ao seu negócio. |
| **Riscos ao titular** | Baixos: dados de empresa; quando o nome da empresa é o nome do profissional, tratar como dado pessoal — mesmo cuidado de transparência e opt-out. |
| **Salvaguardas** (art. 10, §2º) | (1) No primeiro contato, dizer de onde veio o dado ("vi o seu restaurante no Google/no cadastro público"); (2) oferecer saída ("se não quiser mais contato, é só responder SAIR"); (3) atender o pedido de exclusão na hora e anotar no Caçador (status "descartado"); (4) não disparar mensagens em massa; (5) apagar leads descartados ou inativos após [12] meses. |
| **Conclusão** | O interesse legítimo prevalece com as salvaguardas acima. Revisado em [data] por [nome]. |

---

## C. TEXTOS DE CONSENTIMENTO (para o seu cliente usar)

> Curtos, claros e com a saída visível. Guardar quando e onde a pessoa aceitou (data, canal).

**Clube / fidelidade (restaurante, salão)** — no QR da mesa, balcão ou formulário:
> Quero entrar no Clube [Nome] e receber pelo WhatsApp avisos de novidades, do prato do dia e benefícios (no máximo [2] mensagens por semana). Posso sair quando quiser respondendo SAIR. Meus dados ficam só com o [Nome] e não são vendidos nem repassados. ☐ Aceito

**Hóspede (no check-in)**:
> Aceito receber do [Hotel] ofertas de hospedagem e tarifas para hóspedes por [WhatsApp/e-mail]. Posso cancelar a qualquer momento. ☐ Aceito

**Paciente — lembretes (clínica)** — informe no agendamento (base: tutela da saúde):
> Vamos enviar lembretes da sua consulta e da data de retorno pelo WhatsApp. Se preferir não receber, avise a recepção.

**Paciente — comunicações comerciais (clínica)** — **consentimento específico e destacado**, separado do lembrete:
> ☐ Autorizo, de forma específica, a [Clínica] a me enviar informações sobre serviços e condições comerciais por [WhatsApp/e-mail]. Sei que posso revogar esta autorização a qualquer momento.
>
> Atenção às regras do conselho profissional: dentista não pode anunciar preço ou parcelamento nem fazer sorteio ou "indique e ganhe" (CFO); fisioterapeuta não pode anunciar preço ou promoção fora do consultório (COFFITO). Ver [docs/setores/servicos.md](../docs/setores/servicos.md).
