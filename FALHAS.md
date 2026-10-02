# FALHAS — raio-x-margem

| data | o que quebrou | menor correção | prompt \| infra |
|---|---|---|---|
| 2026-10-02 | Importar leads/abrir diagnóstico: "t is not a function" — parâmetro `t` escondia a função de tradução | renomear para `conteudo` + teste de UI checa a mensagem de importação | prompt |
| 2026-10-02 | CNES devolveu 0 leads no Batel — filtro por "esfera administrativa" (é gestão, não propriedade) | filtrar por natureza jurídica (1º dígito 2) | prompt |
| 2026-10-02 | Módulos ES/EN citavam "Pix" como contraste | proibir explicitamente referências ao Brasil no prompt de adaptação + grep no fim | prompt |
| 2026-10-01 | Teste de UI travou no clique após gerar PDF (`emulateMedia print` escondia os botões) | voltar para `screen` depois do PDF | prompt |
