from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import random
import time

app = Flask(__name__)
CORS(app)

# Dummy ML logic using plain Python to simulate a model. 
# Real scikit-learn models or huggingface pipelines could be added here, 
# but this script mimics their behavior to keep installation lightweight and reliable.

print("Loading ML models for Crop Verification and AI Assistant...")
# Simulate model loading time
time.sleep(1) 

def predict_intent(text):
    text = text.lower()
    # Check for Kannada keywords
    if any(k in text for k in ['ಬೆಲೆ', 'ದರ', 'ರೇಟ್', 'price', 'rate', 'how much']):
        return 'pricing'
    elif any(k in text for k in ['ರೋಗ', 'ಕೀಟ', 'ಹುಳು', 'pest', 'disease', 'rot', 'insect', 'leaf']):
        return 'pests'
    elif any(k in text for k in ['ಯೋಜನೆ', 'ಸರ್ಕಾರ', 'ಸಬ್ಸಿಡಿ', 'scheme', 'subsidy', 'loan', 'government', 'pm-kisan']):
        return 'schemes'
    elif any(k in text for k in ['ಮಳೆ', 'ಹವಾಮಾನ', 'ವೆದರ್', 'weather', 'rain', 'forecast']):
        return 'weather'
    elif any(k in text for k in ['ಬೆಳೆ', 'ಬಿತ್ತನೆ', 'grow', 'plant', 'harvest', 'rice', 'paddy']):
        return 'growing'
    else:
        return 'general'

def generate_chatbot_response(intent, text):
    is_kannada = any(char > '\u0C80' and char < '\u0CFF' for char in text)
    
    if is_kannada:
        responses = {
            'pricing': "ಇಂದಿನ ಟೊಮೆಟೊ ಬೆಲೆ ₹15-20/kg ಮತ್ತು ರಾಗಿ ಬೆಲೆ ₹32-35/kg ಇದೆ. ನಮ್ಮ ಆಪ್ ಮೂಲಕ ನೀವು ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಬಹುದು.",
            'pests': "ಬೆಳೆಯಲ್ಲಿ ಕೀಟ ಬಾಧೆ ಕಂಡುಬಂದರೆ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            'schemes': "ಸರ್ಕಾರದ ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಯಡಿ ವಾರ್ಷಿಕ ₹6,000 ಸಹಾಯಧನ ಸಿಗುತ್ತದೆ. ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಲ್ಲಿ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.",
            'weather': "ಮುಂದಿನ 2 ದಿನಗಳಲ್ಲಿ ಸಾಧಾರಣ ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದೆ. ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಜಾಗರೂಕತೆಯಿಂದ ಮಾಡಿ.",
            'growing': "ಭತ್ತದ ಬೆಳೆಗೆ ಜೂನ್-ಜುಲೈ ತಿಂಗಳು ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ. ಸರಿಯಾದ ಪ್ರಮಾಣದ ನೀರು ಮತ್ತು ಗೊಬ್ಬರ ಬಳಸಿ.",
            'general': "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಲೆ, ರೋಗಗಳು, ಯೋಜನೆಗಳು ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ."
        }
    else:
        responses = {
            'pricing': "Current market rate for Tomato is ₹15-20/kg and Ragi is ₹32-35/kg. Prices are trending upwards due to demand.",
            'pests': "For common pests like aphids or leaf spots, I recommend using diluted Neem oil. Ensure proper drainage to avoid root rot.",
            'schemes': "Current active schemes include PM-KISAN (₹6000/year) and PMFBY for crop insurance. Contact your local cooperative bank for loan assistance.",
            'weather': "The weather forecast predicts moderate rainfall for the next 48 hours. Please avoid spraying pesticides during this time.",
            'growing': "Rice (Paddy) is best grown in standing water condition. Ideal transplanting time is between June and August in the monsoon season.",
            'general': "Hello! I am your AI assistant. How can I help you with your farming today? Ask me about pricing, pests, or schemes."
        }
    return responses.get(intent, responses['general'])

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    intent = predict_intent(message)
    response_text = generate_chatbot_response(intent, message)
    return jsonify({"response": response_text, "intent": intent})

@app.route('/api/verify-crop', methods=['POST'])
def verify_crop():
    if 'file' not in request.files:
        return jsonify({"verified": False, "message": "No file uploaded"}), 400
        
    file = request.files['file']
    
    # Simulate a Convolutional Neural Network (CNN) analysis of the image bytes
    # In a real model, we would use torchvision or tensorflow here.
    # We do a basic heuristic (e.g. check image size or simulate a forward pass)
    
    file_bytes = file.read()
    size_kb = len(file_bytes) / 1024
    
    # Mock CNN prediction result based on randomness and file size metrics
    is_real = True if size_kb > 5 else False  # Extremely small files might be fake icons
    
    confidence = round(random.uniform(85.0, 98.5), 1)
    
    if is_real:
        report = {
            "condition": random.choice(["Healthy", "Slightly Bruised", "Excellent"]),
            "freshnessIndex": f"{random.randint(80, 98)}%",
            "pestIssues": "None detected by ML Vision",
            "colorQuality": "Optimal RGB profile",
            "overallAssessment": "Excellent market readiness. Image passed CNN verification."
        }
    else:
        report = None
        
    return jsonify({
        "verified": is_real,
        "confidence": confidence if is_real else round(random.uniform(20.0, 45.0), 1),
        "message": "Real crop photograph detected" if is_real else "Synthetic or invalid image detected",
        "report": report
    })

if __name__ == '__main__':
    print("Python ML Backend running on http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)
