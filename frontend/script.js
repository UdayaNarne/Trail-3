function toggleChatBox() {
    const chatbox = document.getElementById("chatbox");
    chatbox.style.display = (chatbox.style.display === "flex") ? "none" : "flex";

    if (chatbox.style.display === "flex") {
        const chatBody = document.getElementById("chatbox-body");
        chatBody.innerHTML = "";
        showBotMessage("Welcome to Medha Bot! Your Assistant for GVPCE(A)");
    }
}

//const socket = new WebSocket("ws://localhost:10000/chat");
const socket = new WebSocket("wss://medha-yzcp.onrender.com/chat");
socket.onopen = function () {
    console.log("Connected to WebSocket");
};

socket.onmessage = function (event) {
    console.log("Message received:", event.data);
    
    try {
        let response;
        
        if (event.data.startsWith("{") || event.data.startsWith("[")) {
            response = JSON.parse(event.data);
            if (response.message) {
                showBotMessage(response.message);
            } else {
                showBotMessage(JSON.stringify(response));
            }
        } else {
            showBotMessage(event.data); 
        }
    } catch (error) {
        console.error("Error parsing response:", error);
        showBotMessage("Error in response format.");
    }
};

socket.onclose = function () {
    console.warn("WebSocket connection lost.");
    showBotMessage("WebSocket connection lost. Refresh to reconnect.");
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});


function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chatbox-body");

    if (!userInput.value.trim()) return;

    const userMessage = userInput.value.trim().toLowerCase();

    // Show user message in chat
    showUserMessage(userInput.value);

    if (["hii", "hello", "hey", "hi","hlo"].includes(userMessage)) {
        showBotMessage("Hello! How can I assist you?");
    } else {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(userInput.value);
        } else {
            console.warn("WebSocket is closed. Cannot send message.");
            showBotMessage("Connection lost. Please refresh.");
        }
    }

    chatBody.scrollTop = chatBody.scrollHeight;
    userInput.value = "";
}

function showUserMessage(message) {
    const chatBody = document.getElementById("chatbox-body");

    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "chat-message user-message";
    userMsgDiv.innerText = message;

    chatBody.appendChild(userMsgDiv);
}

function showBotMessage(message) {
    const chatBody = document.getElementById("chatbox-body");

    const botMessageContainer = document.createElement("div");
    botMessageContainer.className = "chat-message bot-message-container";
    const botAvatar = document.createElement("img");
    botAvatar.src = "botlogo.jpeg"; 
    botAvatar.className = "bot-avatar";

    const botText = document.createElement("div");
    botText.className = "bot-text";
    botText.innerHTML = convertLinks(message); 
    botMessageContainer.appendChild(botAvatar);
    botMessageContainer.appendChild(botText);

    chatBody.appendChild(botMessageContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function convertLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" class="chat-link">$1</a>');
}

