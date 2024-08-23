function sendMessage(event) {
    event.preventDefault();
    const userMessage = document.getElementById("user-input").value;
    const chatContainer = document.getElementById("chat-container");

    // Display user's question
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "message";
    userMessageDiv.innerHTML = userMessage;
    userDiv.appendChild(userMessageDiv);
    chatContainer.appendChild(userDiv);

    // Make POST request to server
    fetch("/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_question: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        // Display bot's answer
        const botDiv = document.createElement("div");
        botDiv.className = "bot";
        const botMessageDiv = document.createElement("div");
        botMessageDiv.className = "message";
        botMessageDiv.innerHTML = data.answer;
        botDiv.appendChild(botMessageDiv);
        chatContainer.appendChild(botDiv);

        // Scroll to bottom of chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(error => console.error("Error:", error));

    // Clear input field after sending message
    document.getElementById("user-input").value = "";
}
