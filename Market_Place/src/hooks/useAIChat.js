import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useAIChat() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatWelcome') || "Hello! I'm KisanMitra, your farming assistant. How can I help?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // Setup Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
    }
  }, [SpeechRecognition]);

  useEffect(() => {
    if (recognition.current) {
        // Set language based on current app language
        recognition.current.lang = lang === 'en' ? 'en-IN' : 'kn-IN';
    }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text) => {
    if (!isSpeechEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Set synthesis language based on app language
    utterance.lang = lang === 'en' ? 'en-IN' : 'kn-IN';
    window.speechSynthesis.speak(utterance);
  }, [isSpeechEnabled, lang]);

  const handleVoiceInput = useCallback(() => {
    if (!recognition.current) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.current.start();

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [isListening]);

  const suggestions = lang === 'en' 
    ? ["Current crop prices", "Pest control for tomato", "Government schemes", "Weather forecast"]
    : ["ಈಗಿನ ಬೆಳೆ ಬೆಲೆಗಳು", "ಟೊಮೆಟೊ ರೋಗ ನಿಯಂತ್ರಣ", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ"];

  const sendSuggestion = (suggestion) => {
    setInput(suggestion);
    // Use setTimeout to ensure the input state is updated before sending
    setTimeout(() => {
        const dummyEvent = { preventDefault: () => {} };
        // We need a way to pass the suggestion directly to avoid state lag
        sendMessageDirect(suggestion);
    }, 0);
  };

  const sendMessageDirect = async (text) => {
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          lang: lang 
        })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const reply = data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch (err) {
      console.error(err);
      const errorMsg = lang === 'en' 
        ? "An error occurred while connecting to the AI backend."
        : "AI ಬ್ಯಾಕೆಂಡ್ ಸಂಪರ್ಕಿಸುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    sendMessageDirect(input);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    isListening,
    isSpeechEnabled,
    setIsSpeechEnabled,
    messagesEndRef,
    handleVoiceInput,
    sendMessage,
    speak,
    suggestions,
    sendSuggestion
  };
}
