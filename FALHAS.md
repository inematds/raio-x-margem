# FALHAS — raio-x-margem

| data | o que quebrou | menor correção | prompt \| infra |
|---|---|---|---|
| 2026-10-02 | Piloto salões: 6 estéticas diferentes receberam o mesmo site (`esteticabatel.com.br`) — "estética" casava nome com domínio | tirar palavras genéricas da comparação + descartar site atribuído pela busca a mais de um lead | prompt |
| 2026-10-02 | Piloto clínicas/salões: 25 das 50 buscas do Firecrawl falharam com HTTP 429 (rajada no plano gratuito) — parecia "poucos sites" | intervalo mínimo de 13 s entre buscas + nova tentativa com recuo no 429 (`--intervalo-busca`) | infra |
| 2026-10-02 | Importar leads/abrir diagnóstico: "t is not a function" — parâmetro `t` escondia a função de tradução | renomear para `conteudo` + teste de UI checa a mensagem de importação | prompt |
| 2026-10-02 | CNES devolveu 0 leads no Batel — filtro por "esfera administrativa" (é gestão, não propriedade) | filtrar por natureza jurídica (1º dígito 2) | prompt |
| 2026-10-02 | Módulos ES/EN citavam "Pix" como contraste | proibir explicitamente referências ao Brasil no prompt de adaptação + grep no fim | prompt |
| 2026-10-01 | Teste de UI travou no clique após gerar PDF (`emulateMedia print` escondia os botões) | voltar para `screen` depois do PDF | prompt |
