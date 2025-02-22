from fastapi import FastAPI, WebSocket
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (Change to your frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load classification model
MODEL_NAME = "UdayaNarne/fine-tuned-bert"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# Load label map
with open("label_map.json", "r") as f:
    label_map = json.load(f)
try:
    with open("intent_response.json", "r") as f:
        intent_responses = json.load(f)
except FileNotFoundError:
    intent_responses = {}

@app.websocket("/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()

    while True:
        user_input = await websocket.receive_text()  # Receive message

        # Tokenize input
        inputs = tokenizer(user_input, return_tensors="pt", padding=True, truncation=True, max_length=128)
        
        # Get model prediction
        outputs = model(**inputs)
        predicted_label = torch.argmax(outputs.logits, dim=1).item()
        
        # Get intent name from label_map
        intent_name = list(label_map.keys())[list(label_map.values()).index(predicted_label)]
        response = intent_responses.get(intent_name, intent_responses["default"])
        # Send response
        await websocket.send_text({response})
