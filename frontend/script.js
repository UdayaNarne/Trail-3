function toggleChatBox() {
    const chatbox = document.getElementById("chatbox");
    chatbox.style.display = (chatbox.style.display === "flex") ? "none" : "flex";

    if (chatbox.style.display === "flex") {
        const chatBody = document.getElementById("chatbox-body");
        chatBody.innerHTML = "";
        showBotMessage("Welcome to Medha Bot! Your Assistant for GVPCE(A)");
    }
}

// WebSocket Connection (Update the WebSocket URL when deployed)
const socket = new WebSocket("ws://localhost:10000/chat");

socket.onopen = function () {
    console.log("✅ Connected to WebSocket");
};

// Handle incoming WebSocket messages
socket.onmessage = function (event) {
    console.log("📩 Message received:", event.data);
    
    try {
        let response;
        
        // Try to parse as JSON
        if (event.data.startsWith("{") || event.data.startsWith("[")) {
            response = JSON.parse(event.data);
            if (response.message) {
                showBotMessage(response.message);
            } else {
                showBotMessage(JSON.stringify(response)); // Display raw JSON if no 'message' key
            }
        } else {
            showBotMessage(event.data); // Plain text response
        }
    } catch (error) {
        console.error("❌ Error parsing response:", error);
        showBotMessage("⚠️ Error in response format.");
    }
};

// Handle WebSocket close
socket.onclose = function () {
    console.warn("❌ WebSocket connection lost.");
    showBotMessage("⚠️ WebSocket connection lost. Refresh to reconnect.");
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

// Function to Send Message
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chatbox-body");

    if (!userInput.value.trim()) return;

    const userMessage = userInput.value.trim().toLowerCase();

    // Show user message in chat
    showUserMessage(userInput.value);

    // Handle basic greetings locally
    if (["hii", "hello", "hey", "hi"].includes(userMessage)) {
        showBotMessage("Hello! How can I assist you?");
    } else {
        // Send message to WebSocket if open
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(userInput.value);
        } else {
            console.warn("❌ WebSocket is closed. Cannot send message.");
            showBotMessage("⚠️ Connection lost. Please refresh.");
        }
    }

    chatBody.scrollTop = chatBody.scrollHeight;
    userInput.value = "";
}

// Function to Show User Message
function showUserMessage(message) {
    const chatBody = document.getElementById("chatbox-body");

    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "chat-message user-message";
    userMsgDiv.innerText = message;

    chatBody.appendChild(userMsgDiv);
}

// Function to Show Bot Message (Avatar and Text Side by Side)
// Function to Show Bot Message (Avatar and Text with Clickable Links)
function showBotMessage(message) {
    const chatBody = document.getElementById("chatbox-body");

    const botMessageContainer = document.createElement("div");
    botMessageContainer.className = "chat-message bot-message-container";

    // Bot Avatar
    const botAvatar = document.createElement("img");
    botAvatar.src = "botlogo.jpeg"; 
    botAvatar.className = "bot-avatar";

    // Bot Text (with Clickable Links)
    const botText = document.createElement("div");
    botText.className = "bot-text";
    botText.innerHTML = convertLinks(message); // Convert URLs to clickable links

    // Append Avatar and Text separately
    botMessageContainer.appendChild(botAvatar);
    botMessageContainer.appendChild(botText);

    chatBody.appendChild(botMessageContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Function to Convert URLs in Text to Clickable Links
function convertLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" class="chat-link">$1</a>');
}

