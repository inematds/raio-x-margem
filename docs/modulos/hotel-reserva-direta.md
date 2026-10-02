# Módulo (hotel): Reserva direta sem quebrar paridade

> Ataca: **OTA cobrando de hóspede que já é seu**, **programa de visibilidade que não se paga**, **hóspede que não volta**, **receita extra**, **cotação manual**, **no-show**. Regras de contrato: [docs/setores/hotel.md](../setores/hotel.md#contratos--o-que-muda-na-estratégia).

## Regra que manda em tudo

No Brasil a Booking aplica **paridade restrita**: o site do hotel não pode **publicar** tarifa menor que a da Booking. O canal direto ganha por:

1. **Tarifa fechada** — não publicada online: e-mail, WhatsApp, balcão, área de membro para base consentida (exceção da cl. 2.2.2; validar com advogado do hotel).
2. **Benefício em vez de desconto** — café incluso, late checkout, upgrade sujeito a disponibilidade, garrafa de vinho, crédito no restaurante parceiro.
3. **Conveniência** — motor de reserva rápido, Pix, confirmação imediata, conversa direta com a casa.

## Peças

| Peça | Para quê | Caminho A (pronto) | Caminho B (aberto) |
|---|---|---|---|
| Motor de reserva | reservar e pagar no site | do PMS (Hospedin, Omnibees, Silbeck, HSystem, Cloudbeds) | TastyIgniter não serve; para pousada pequena: calendário + Pix + confirmação manual |
| Base própria consentida | falar com quem já se hospedou | ficha de check-in com opt-in (papel ou digital) | planilha/CRM ([alternativas](../ALTERNATIVAS-ABERTAS.md)) |
| Pré-check-in | vender extras e coletar opt-in | mensagem 3 dias antes com link | formulário próprio |
| Garantia | reduzir no-show | política + sinal por Pix | Pix estático/dinâmico ([cobrança](cobranca.md)) |
| Teste do Preferencial | ver se o +3 p.p. se paga | 2 meses sem × com, mesma época do ano anterior | planilha de canal |

## O que **não** fazer

- Publicar no site preço menor que na Booking.
- Mandar mensagem para o contato que a OTA forneceu (Booking cl. 2.9.3; Airbnb 11.1).
- Convidar para "reservar direto da próxima vez" **dentro** da mensageria da OTA ou do Airbnb.
- Anunciar usando a marca da OTA.

## Roteiro de hóspede (com consentimento coletado pelo hotel)

1. Check-in: "quer receber nossas ofertas de baixa temporada e tarifa de hóspede?" (opt-in registrado).
2. Durante a estadia: cartão no quarto com QR do clube de hóspedes.
3. Check-out + 2 dias: agradecimento + pedido de avaliação no Google.
4. Aniversário da estadia / baixa temporada: tarifa fechada de hóspede, por mensagem.

## Checklist

- [ ] Receita e comissão por canal dos últimos 12 meses (base sazonal)
- [ ] Motor de reserva no site com Pix e cartão, testado no celular
- [ ] Tarifa fechada e benefícios definidos por escrito, sem publicar online
- [ ] Opt-in no check-in + planilha/CRM
- [ ] Mensagem de pré-check-in com 3 extras
- [ ] Política de garantia publicada e aplicada
- [ ] Teste do programa Preferencial/Genius agendado (com data de volta)

## Como medir

% da receita por canal direto × OTA, mês a mês contra o **mesmo mês do ano anterior**; comissão total paga; % de reservas com extra; no-show não cobrado; taxa de retorno em 12 meses por coorte.
