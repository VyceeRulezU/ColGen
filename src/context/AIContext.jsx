import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeGemini } from "../services/gemini";

const AIContext = createContext();

export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }) => {
  // Initialize with the provided key for testing purposes
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "AIzaSyCSWyjm-79yRod9-DJIeNL19VluT5yy-ps");
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
