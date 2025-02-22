
function toggleChatBox() {
    const chatbox = document.getElementById("chatbox");
    chatbox.style.display = chatbox.style.display === "flex" ? "none" : "flex";
}
const socket = new WebSocket("ws://localhost:8000/chat");

socket.onopen = function () {
    console.log("Connected to WebSocket");
};

socket.onmessage = function (event) {
    console.log("Message from server:", event.data);

    // Append bot response to the chatbox
    const chatBody = document.getElementById("chatbox-body");
    const botMessage = document.createElement("div");
    botMessage.className = "chat-message bot-message";
    botMessage.innerText = event.data;
    chatBody.appendChild(botMessage);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
};

socket.onerror = function (error) {
    console.error("WebSocket Error:", error);
};

socket.onclose = function () {
    console.log("WebSocket connection closed");
};

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    const chatBody = document.getElementById("chatbox-body");

    if (userInput === "") return;

    // Display user message in chatbox
    const userMessage = document.createElement("div");
    userMessage.className = "chat-message user-message";
    userMessage.innerText = userInput;
    chatBody.appendChild(userMessage);

    // Send message to WebSocket server
    socket.send(JSON.stringify({ intent: userInput }));

    // Clear input field
    document.getElementById("user-input").value = "";
}


