# teste-dynadok-llm

Para iniciar o serviço python, utilizei no git bash um venv e na sequência uvicorn app.main:app --reload --port 8000
Iniciar o servidor node com npm run dev na pasta do node

Testei tanto no powershell com: 

PS C:\Windows\system32> $body = @{
>>     text = "Diagnósticos médicos e decisoes jurídicas: o papel da IA. A justiça e a Medicina sao considerados campos de alto risco. Neles é mais urgente do que em qualquer outra área estabelecer sistemas para que os humanos tenham sempre a decisao final."
>>     lang = "en"
>> } | ConvertTo-Json
>>
>> Invoke-RestMethod -Uri "http://localhost:3005/tasks" -Method Post -Body $body -ContentType "application/json"
>> 
quando no git bash com: 

curl -X POST http://localhost:3005/tasks -H "Content-Type: application/json" -d '{"text": "Diagnósticos médicos e decisoes jurídicas: o papel da IA. A justiça e a Medicina sao considerados campos de alto risco. Neles é mais urgente do que em qualquer outra área estabelecer sistemas para que os humanos tenham sempre a decisao final.", "lang": "en"}'

para requisitar os diferentes serviços: 

recebe todas as tasks: 

curl http://localhost:3005/tasks

recebe task específica por ID: 

curl http://localhost:3005/tasks/{taskId}

para deletar uma task específica pela ID:

curl -X DELETE http://localhost:3005/tasks/{taskId}
