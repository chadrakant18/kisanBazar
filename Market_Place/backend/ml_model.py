# Force HAS_SKLEARN to False to save memory in constrained environment
HAS_SKLEARN = False
print("[INFO] scikit-learn disabled for memory efficiency. Using keyword-based classification.")

import re

# Training data for the ML classifier
TRAINING_DATA = [
    # Season / Planting
    ("when to plant rice", "season"), ("best time to sow wheat", "season"),
    ("which month to grow tomato", "season"), ("sowing season for ragi", "season"),
    ("planting time for onion", "season"), ("when should I plant mango", "season"),
    ("harvest time for banana", "season"), ("which season is best for crops", "season"),
    ("when to start farming", "season"), ("monsoon planting guide", "season"),
    ("kharif season crops", "season"), ("rabi season crops", "season"),
    ("summer crops to grow", "season"), ("when to harvest paddy", "season"),
    ("best month for sowing seeds", "season"), ("crop calendar", "season"),
    # Pricing / Market
    ("what is the price of rice", "pricing"), ("tomato market rate today", "pricing"),
    ("current onion price", "pricing"), ("msp for wheat", "pricing"),
    ("how much can I sell mango for", "pricing"), ("banana selling price", "pricing"),
    ("market rate for ragi", "pricing"), ("crop prices today", "pricing"),
    ("best price for my harvest", "pricing"), ("mandi rates", "pricing"),
    ("apmc market price", "pricing"), ("wholesale price of vegetables", "pricing"),
    ("profit from farming", "pricing"), ("income from one acre", "pricing"),
    ("selling rate of crops", "pricing"), ("commodity prices", "pricing"),
    # Pests / Disease
    ("pest control for tomato", "pests"), ("how to prevent leaf curl", "pests"),
    ("rice blast disease treatment", "pests"), ("insect problem in onion", "pests"),
    ("fungus on mango leaves", "pests"), ("yellow leaves on banana", "pests"),
    ("wilt disease in crops", "pests"), ("blight treatment for wheat", "pests"),
    ("organic pesticide for crops", "pests"), ("neem oil spray usage", "pests"),
    ("aphid infestation control", "pests"), ("caterpillar damage prevention", "pests"),
    ("root rot treatment", "pests"), ("white fly control", "pests"),
    ("crop disease identification", "pests"), ("pesticide recommendation", "pests"),
    # Government Schemes
    ("pm kisan scheme details", "schemes"), ("government subsidy for farmers", "schemes"),
    ("kcc loan interest rate", "schemes"), ("crop insurance scheme", "schemes"),
    ("pmfby details", "schemes"), ("farmer welfare schemes", "schemes"),
    ("how to apply for farm loan", "schemes"), ("soil health card scheme", "schemes"),
    ("enam online trading", "schemes"), ("agriculture subsidy karnataka", "schemes"),
    ("free electricity for farmers", "schemes"), ("drip irrigation subsidy", "schemes"),
    ("farm equipment subsidy", "schemes"), ("rural development schemes", "schemes"),
    # Weather
    ("weather forecast today", "weather"), ("will it rain tomorrow", "weather"),
    ("monsoon prediction this year", "weather"), ("temperature forecast", "weather"),
    ("weather for farming", "weather"), ("rainfall expected", "weather"),
    ("drought conditions", "weather"), ("humidity levels today", "weather"),
    ("wind speed for spraying", "weather"), ("frost warning", "weather"),
    # Growing / Cultivation
    ("how to grow rice", "growing"), ("tomato cultivation tips", "growing"),
    ("best soil for wheat", "growing"), ("water requirement for banana", "growing"),
    ("fertilizer for onion", "growing"), ("organic farming methods", "growing"),
    ("drip irrigation setup", "growing"), ("seed selection guide", "growing"),
    ("crop rotation benefits", "growing"), ("mulching techniques", "growing"),
    ("composting for farm", "growing"), ("soil preparation tips", "growing"),
    ("best varieties of mango", "growing"), ("yield improvement tips", "growing"),
    ("how much water does rice need", "growing"), ("spacing for tomato plants", "growing"),
    # Contact / Help
    ("farmer helpline number", "contact"), ("agriculture department contact", "contact"),
    ("emergency help for farmers", "contact"), ("kisan call center", "contact"),
    ("where to get help", "contact"), ("support number", "contact"),
    # General / Greeting
    ("hello", "general"), ("hi", "general"), ("good morning", "general"),
    ("what can you do", "general"), ("help me", "general"),
    ("namaste", "general"), ("thank you", "general"), ("thanks", "general"),
]

# Kannada keyword mappings for intent detection
KANNADA_KEYWORDS = {
    'season': ['ಯಾವಾಗ', 'ಕಾಲ', 'ಋತು', 'ಬಿತ್ತನೆ', 'ಸಮಯ', 'ತಿಂಗಳು', 'ನಾಟಿ', 'ಬೆಳೆಯುವ'],
    'pricing': ['ಬೆಲೆ', 'ದರ', 'ರೇಟ್', 'ಮಾರುಕಟ್ಟೆ', 'ಮಾರಾಟ', 'ಲಾಭ', 'ಆದಾಯ'],
    'pests': ['ರೋಗ', 'ಕೀಟ', 'ಹುಳು', 'ಎಲೆ', 'ಶಿಲೀಂಧ್ರ', 'ಔಷಧ', 'ಸಿಂಪಡಣೆ'],
    'schemes': ['ಯೋಜನೆ', 'ಸರ್ಕಾರ', 'ಸಬ್ಸಿಡಿ', 'ಸಾಲ', 'ವಿಮೆ', 'ಅನುದಾನ'],
    'weather': ['ಮಳೆ', 'ಹವಾಮಾನ', 'ತಾಪಮಾನ', 'ಗಾಳಿ', 'ಬಿಸಿಲು'],
    'growing': ['ಬೆಳೆ', 'ಗೊಬ್ಬರ', 'ನೀರು', 'ಮಣ್ಣು', 'ಇಳುವರಿ', 'ಬೀಜ', 'ಬೆಳೆಸು', 'ವಿಧಾನ'],
    'contact': ['ಸಹಾಯ', 'ಸಂಪರ್ಕ', 'ಫೋನ್', 'ನಂಬರ್'],
    'general': ['ನಮಸ್ಕಾರ', 'ಹಲೋ', 'ಧನ್ಯವಾದ'],
}


class IntentClassifier:
    def __init__(self):
        if HAS_SKLEARN:
            self.pipeline = Pipeline([
                ('tfidf', TfidfVectorizer(
                    max_features=500,
                    ngram_range=(1, 2),
                    stop_words='english',
                    lowercase=True
                )),
                ('clf', MultinomialNB(alpha=0.1))
            ])
            self._train()
        else:
            print("[ML] Skill-based intent detection activated (Keyword mode)")

    def _train(self):
        if HAS_SKLEARN:
            texts = [t for t, _ in TRAINING_DATA]
            labels = [l for _, l in TRAINING_DATA]
            self.pipeline.fit(texts, labels)
            self.classes = self.pipeline.classes_
            print(f"[ML] Intent classifier trained on {len(texts)} samples, {len(set(labels))} intents")

    def predict(self, text):
        """Predict intent. For Kannada text, use keyword matching; for English, use ML model or keywords."""
        is_kannada = any('\u0C80' < c < '\u0CFF' for c in text)

        if is_kannada:
            return self._predict_kannada(text)

        if HAS_SKLEARN:
            proba = self.pipeline.predict_proba([text.lower()])[0]
            best_idx = np.argmax(proba)
            confidence = proba[best_idx]

            if confidence < 0.25:
                return 'general', confidence
            return self.classes[best_idx], confidence
        else:
            # Fallback keyword matching for English
            return self._predict_english_keywords(text)

    def _predict_english_keywords(self, text):
        text = text.lower()
        # Simple heuristic mapping for English
        keywords = {
            'season': ['season', 'when to', 'which month', 'time to sow', 'harvest time'],
            'pricing': ['price', 'rate', 'cost', 'sell', 'market', 'msp', 'mandi'],
            'pests': ['pest', 'disease', 'insect', 'fungus', 'leaf curl', 'spray', 'pesticide'],
            'schemes': ['scheme', 'government', 'subsidy', 'loan', 'insurance', 'pm-kisan', 'kcc'],
            'weather': ['weather', 'rain', 'forecast', 'temperature', 'monsoon'],
            'growing': ['grow', 'cultivate', 'soil', 'water', 'fertilizer', 'yield', 'tips'],
            'contact': ['help', 'contact', 'call', 'number', 'support']
        }
        
        scores = {intent: 0 for intent in keywords}
        for intent, kws in keywords.items():
            for kw in kws:
                if kw in text:
                    scores[intent] += 1
        
        if any(scores.values()):
            best = max(scores, key=scores.get)
            return best, 0.6
        return 'general', 0.5

    def _predict_kannada(self, text):
        scores = {}
        for intent, keywords in KANNADA_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in text)
            if score > 0:
                scores[intent] = score
        if scores:
            best = max(scores, key=scores.get)
            return best, min(scores[best] / 3.0, 1.0)
        return 'general', 0.5
