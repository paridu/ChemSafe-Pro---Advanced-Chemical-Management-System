
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async analyzeHazard(chemicalName: string, casNumber: string) {
    // Fix: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        // Fix: Upgrade to gemini-3-pro-preview for complex text tasks involving advanced reasoning
        model: 'gemini-3-pro-preview',
        contents: `Provide a brief OSHA/GHS safety summary for the chemical "${chemicalName}" (CAS: ${casNumber}). Focus on: 1. Primary Hazards, 2. PPE Requirements, 3. Storage Compatibility. Keep it professional and concise.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to perform AI risk assessment at this time.";
    }
  }

  async getComplianceAdvice(query: string) {
    // Fix: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        // Fix: Upgrade to gemini-3-pro-preview for complex text tasks involving advanced reasoning
        model: 'gemini-3-pro-preview',
        contents: `As an ISO 14001 and OSHA compliance expert, answer: ${query}`,
        config: {
          systemInstruction: "You are a professional safety and environmental compliance officer."
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Compliance Error:", error);
      return "Compliance assistant is offline.";
    }
  }

  async predictStockExhaustion(chemicalName: string, currentStock: number, history: string) {
    // Fix: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        // Fix: Upgrade to gemini-3-pro-preview for complex text tasks involving advanced reasoning
        model: 'gemini-3-pro-preview',
        contents: `Analyze this stock data for ${chemicalName}. Current Stock: ${currentStock}. History: ${history}. Predict when the stock will run out. Provide a single date or range.`,
      });
      return response.text;
    } catch (error) {
      return "Prediction unavailable.";
    }
  }
}

export const gemini = new GeminiService();
