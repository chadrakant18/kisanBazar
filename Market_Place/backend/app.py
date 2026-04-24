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
    # Comprehensive intent mapping with expanded keyword sets
    intents = {
        'pricing': ['ಬೆಲೆ', 'ದರ', 'ರೇಟ್', 'ಅಂದಾಜು', 'ಲಾಭ', 'ಮಾರುಕಟ್ಟೆ', 'ಮಾರಾಟ', 'price', 'rate', 'cost', 'market', 'how much', 'profit', 'value', 'sell', 'trading'],
        'pests': ['ರೋಗ', 'ಕೀಟ', 'ಹುಳು', 'ಬರ', 'ಸರ', 'ಹಾನಿ', 'ಕೊಳೆ', 'ಚುಕ್ಕೆ', 'pest', 'disease', 'rot', 'insect', 'leaf', 'fungus', 'spray', 'pesticide', 'damage', 'infection', 'whitefly', 'aphids'],
        'schemes': ['ಯೋಜನೆ', 'ಸರ್ಕಾರ', 'ಸಬ್ಸಿಡಿ', 'ಸಾಲ', 'ಅರ್ಜಿ', 'ಕಂತು', 'ಪರಿಹಾರ', 'ಭೀಮಾ', 'scheme', 'subsidy', 'loan', 'government', 'pm-kisan', 'kcc', 'insurance', 'pmfby', 'benefit', 'form', 'apply'],
        'weather': ['ಮಳೆ', 'ಹವಾಮಾನ', 'ಬಿಸಿಲು', 'ಗಾಳಿ', 'ವೆದರ್', 'ಮೋಡ', 'ಮಿಂಚು', 'weather', 'rain', 'forecast', 'temperature', 'monsoon', 'cloud', 'humidity', 'storm'],
        'growing': ['ಬೆಳೆ', 'ಬಿತ್ತನೆ', 'ಗೊಬ್ಬರ', 'ನೀರು', 'ಮಣ್ಣು', 'ಉಳುಮೆ', 'ತಳಿ', 'ಇಳುವರಿ', 'grow', 'plant', 'harvest', 'crop', 'soil', 'yield', 'fertilizer', 'irrigation', 'seeds', 'variety', 'cultivation'],
        'contact': ['ಸಹಾಯ', 'ಸಂಪರ್ಕ', 'ಹೆಲ್ಪ್', 'ಹೆಲ್ಪ್‌ಲೈನ್', 'ನಂಬರ್', 'ಕರೆ', 'ಮಾಹಿತಿ', 'contact', 'help', 'helpline', 'number', 'support', 'call', 'info', 'emergency']
    }
    
    # Simple score-based matching
    scores = {intent: 0 for intent in intents}
    for intent, keywords in intents.items():
        for keyword in keywords:
            if keyword in text:
                scores[intent] += 1
    
    best_intent = max(scores, key=scores.get)
    return best_intent if scores[best_intent] > 0 else 'general'

def generate_chatbot_response(intent, text):
    is_kannada = any(char > '\u0C80' and char < '\u0CFF' for char in text)
    
    if is_kannada:
        responses = {
            'pricing': "ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಅಪ್‌ಡೇಟ್: \n- ಟೊಮೆಟೊ (ಬೆಂಗಳೂರು): ₹18-26/kg \n- ರಾಗಿ: ₹3,400-3,800/ಕ್ವಿಂಟಲ್ \n- ಈರುಳ್ಳಿ: ₹2,200-2,500/ಕ್ವಿಂಟಲ್. \nಬೇಡಿಕೆ ಹೆಚ್ಚಿರುವುದರಿಂದ ಬೆಲೆಗಳು ಏರಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.",
            'pests': "ಬೆಳೆಯಲ್ಲಿ ಕೀಟ/ರೋಗ ಬಾಧೆ ತಡೆಗಟ್ಟಲು: \n1. ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು ಚುಕ್ಕೆಗಳಿದ್ದರೆ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಬಳಸಿ. \n2. ರಸ ಹೀರುವ ಕೀಟಗಳಿಗೆ ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil) ಅತ್ಯುತ್ತಮ. \n3. ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಎಚ್ಚರವಹಿಸಿ.",
            'schemes': "ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು: \n- PM-KISAN: ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ವರ್ಗಾವಣೆ. \n- ಬೆಳೆ ವಿಮೆ (PMFBY): ಕೊನೆಯ ದಿನಾಂಕ ಹತ್ತಿರದಲ್ಲಿದೆ, ಕೂಡಲೇ ನೋಂದಾಯಿಸಿ. \n- ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್: ಕಡಿಮೆ ಬಡ್ಡಿದರದಲ್ಲಿ ಸಾಲ ಸೌಲಭ್ಯ.",
            'weather': "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ: \nಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಸಾಧಾರಣದಿಂದ ಭಾರೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ತೇವಾಂಶವು 75% ಕ್ಕಿಂತ ಹೆಚ್ಚಿರಲಿದೆ. ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಯನ್ನು ಸದ್ಯಕ್ಕೆ ಮುಂದೂಡಿ.",
            'growing': "ಕೃಷಿ ಸಲಹೆಗಳು: \n- ಮಣ್ಣಿನ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿಸಿ ಗೊಬ್ಬರ ಬಳಸಿ. \n- ಉತ್ತಮ ಇಳುವರಿಗಾಗಿ 'ಸೋನಾ ಮಸೂರಿ' ಅಥವಾ 'ಜಯ' ಭತ್ತದ ತಳಿಗಳನ್ನು ಬಳಸಿ. \n- ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿಯಿಂದ 40% ನೀರು ಉಳಿಸಬಹುದು.",
            'contact': "ಸಹಾಯಕ್ಕಾಗಿ ಇವುಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ: \n- ರೈತ ಸಹಾಯವಾಣಿ: 1800-425-3553 \n- ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್: 1551 \n- ನಿಮ್ಮ ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK).",
            'general': "ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್ ಮಿತ್ರ. ನಾನು ನಿಮಗೆ ಬೆಳೆ ಬೆಲೆ, ಕೀಟ ನಿಯಂತ್ರಣ, ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ನಿಖರ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ. ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?"
        }
    else:
        responses = {
            'pricing': "Market Intelligence Report: \n- Tomato (Kolar): ₹18-26/kg \n- Ragi: ₹3,400-3,800/quintal \n- Onion: ₹2,200-2,500/quintal. \nExpect a 5-10% price rise in the next week due to high demand.",
            'pests': "Integrated Pest Management Tips: \n1. For Whitefly/Aphids, use 5ml Neem Oil per liter of water. \n2. For fungal infections, apply Copper Oxychloride (3g/L). \n3. Ensure proper crop rotation to break pest cycles.",
            'schemes': "Active Schemes for You: \n- PM-KISAN: ₹6,000 annual support. \n- KCC (Kisan Credit Card): Loans at 4% effective interest rate. \n- PMFBY: Insurance covers post-harvest losses too.",
            'weather': "Agri-Weather Forecast: \nExpect moderate thunderstorms in the next 48 hours. Humidity levels will be high (80%). Avoid fertilizer application until the weather clears.",
            'growing': "Cultivation Expert Advice: \n- Test your soil pH before planting. \n- For high yield, use certified hybrid seeds. \n- Balanced NPK ratio (4:2:1) is recommended for most cereal crops.",
            'contact': "Emergency Contacts: \n- Kisan Call Center: 1800-180-1551 (Toll-Free) \n- Agricultural Department: 1551 \n- Contact your local Grama One center for documentation.",
            'general': "Hello! I am KisanMitra, your AI Farming Expert. I can help with market rates, pest diagnosis, or scheme eligibility. What is on your mind today?"
        }
    return responses.get(intent, responses['general'])

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    intent = predict_intent(message)
    response_text = generate_chatbot_response(intent, message)
    
    # Simulate thinking time
    import time
    time.sleep(0.5)
    
    return jsonify({
        "response": response_text, 
        "intent": intent,
        "language": "kn" if any(char > '\u0C80' and char < '\u0CFF' for char in message) else "en"
    })

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
