// URL da API do Ollama que está rodando o Gemma 2
const apiUrl = "http://localhost:11434/api/generate";

// Evento de clique no botão enviar
document.getElementById("sendButton").addEventListener("click", function () {
    const userMessage = document.getElementById("userInput").value.trim();

    // Verificar se a mensagem do usuário está vazia
    if (userMessage === "") {
        alert("Digite uma mensagem!");
        return;
    }

    // Exibir a mensagem do usuário no chat
    const chatlogs = document.getElementById("chatlogs");
    chatlogs.innerHTML += `<div class="message"><strong>Você:</strong> ${userMessage}</div>`;

    // Adiciona a animação na mensagem do usuário
    const newMessage = chatlogs.lastChild;
    newMessage.classList.add("message");

    // Limpar o campo de entrada do usuário
    document.getElementById("userInput").value = "";

    // Exibir o efeito "digitando..." enquanto espera a resposta da IA
    const typingIndicator = document.createElement("div");
    typingIndicator.id = "typing";
    typingIndicator.innerHTML = "Gemma2 está digitando...";
    chatlogs.appendChild(typingIndicator);

    // Scroll automático para o final do chat
    chatlogs.scrollTop = chatlogs.scrollHeight;

    // Enviar a mensagem para a API do Ollama (usando o modelo Gemma)
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gemma",  // Especifica o modelo "gemma"
            prompt: userMessage,  // Mensagem do usuário
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        // Remove o indicador "digitando..."
        typingIndicator.remove();

        // Exibir a resposta da API no chat com animação
        chatlogs.innerHTML += `<div class="message"><strong>Gemma2:</strong> ${data.text}</div>`;
        
        // Adiciona a animação na resposta da IA
        const newResponse = chatlogs.lastChild;
        newResponse.classList.add("message");

        // Scroll automático para o final do chat
        chatlogs.scrollTop = chatlogs.scrollHeight;
    })
    .catch((error) => {
        console.error("Erro ao se comunicar com o Ollama:", error);
        typingIndicator.remove();
        chatlogs.innerHTML += `<div class="message"><strong>Erro:</strong> Falha ao se comunicar com o servidor.</div>`;
        
        // Scroll automático para o final do chat
        chatlogs.scrollTop = chatlogs.scrollHeight;
    });
});
