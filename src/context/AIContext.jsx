import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeGemini } from "../services/gemini";

const AIContext = createContext();

export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [chatHistory, setChatHistory] = useState([]);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("gemini_api_key", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      initializeGemini(apiKey);
      setIsConfigured(true);
    } else {
      setIsConfigured(false);
    }
  }, [apiKey]);

  const saveApiKey = (key) => {
    setApiKey(key);
  };

  const addMessageToHistory = (role, content) => {
    setChatHistory((prev) => [...prev, { role, content }]);
  };

  return (
    <AIContext.Provider value={{ apiKey, saveApiKey, isConfigured, chatHistory, addMessageToHistory }}>
      {children}
    </AIContext.Provider>
  );
};
