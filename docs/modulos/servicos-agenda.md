# Módulo (serviços com agenda): Agenda cheia

> Ataca: **falta sem aviso**, **horário que nunca foi agendado**, **cliente que não volta no prazo**, **plataforma cobrando de quem já é seu**, **recepção presa marcando à mão**. Vale para todo perfil do modelo padrão "Serviços com agenda" (clínica, salão, barbearia, estúdio, pet shop…). Regras específicas de cada perfil (conselhos profissionais, LGPD de saúde) ficam em [docs/setores/servicos.md](../setores/servicos.md).

## As cinco peças

| Peça | O que resolve | Como |
|---|---|---|
| **Confirmação automática** | falta sem aviso | mensagem 24–48 h antes com "confirmar / remarcar"; quem não responde vai para ligação |
| **Lista de espera** | falta e cancelamento em cima da hora | cancelou → oferta automática do horário para quem pediu aquele dia |
| **Sinal por Pix** | falta em horário disputado | sinal só nos horários nobres ou em {cliente} que já faltou; política escrita e avisada |
| **Retorno programado** | {cliente} que não volta | ao fim do atendimento, já agendar ou registrar a data do próximo; lembrete na data |
| **Plano / assinatura** | ociosidade e retorno | pacote mensal ou clube com cobrança por Pix Automático (desde 06/2025) |

## Ordem recomendada

1. **Medir** 4 semanas de agenda: faltas, ocupação por faixa de horário, retorno no prazo.
2. **Confirmação + lista de espera** (efeito em 2 semanas, paga o resto).
3. **Retorno programado** com base própria consentida.
4. **Plano/assinatura** só depois que a agenda estiver organizada.

## Caminhos

**A — sistema pronto:** quase todo sistema de agenda do nicho tem confirmação e agendamento online (ver opções e preços em [docs/setores/servicos.md](../setores/servicos.md)). Critério para escolher: confirmação por WhatsApp, lista de espera, exporta a base de {clientes}, **não cobra comissão por agendamento de quem já é da casa**.

**B — mínimo aberto:** WhatsApp Business (mensagens rápidas e etiquetas) + planilha de retorno + Pix. Ver [ALTERNATIVAS-ABERTAS.md](../ALTERNATIVAS-ABERTAS.md).

## Cuidados

- **Lembrete não é propaganda.** Mensagem de confirmação e de retorno é serviço; promoção é outra coisa e, em clínica, tem regra do conselho profissional.
- **Base própria só com consentimento** coletado pelo próprio negócio. Contato vindo de marketplace segue os termos dele.
- **Sinal não é multa surpresa:** política escrita, avisada no agendamento.

## Checklist

- [ ] 4 semanas de agenda medidas (base "antes")
- [ ] Confirmação automática ligada e testada
- [ ] Lista de espera funcionando
- [ ] Política de sinal escrita (se for usar)
- [ ] Data de retorno registrada em todo atendimento
- [ ] Opt-in coletado e guardado

## Como medir

% de faltas, ocupação por faixa de horário e retorno no prazo, mês contra mês; horas de recepção em agenda; receita de planos.
