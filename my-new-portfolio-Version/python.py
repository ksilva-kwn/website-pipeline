import requests

def get_response(prompt):
    response = requests.post('http://localhost:11434/api/chat', json={'prompt': prompt})
    return response.json().get('response', '')

user_input = "Qual é a sua pergunta?"
response = get_response(user_input)
print("Resposta do Chatbot:", response)
