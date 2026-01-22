
import { GoogleGenAI } from "@google/genai";

/**
 * AIServiceHub
 * เตรียมพร้อมสำหรับ RAG (Retrieval-Augmented Generation) 
 * และการสลับระหว่าง Cloud AI (Gemini) และ Local AI (Ollama)
 */
export class AIServiceHub {
  constructor() {}

  // --- Cloud AI (Gemini) Methods ---
  async analyzeHazard(chemicalName: string, casNumber: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Provide a brief OSHA/GHS safety summary for the chemical "${chemicalName}" (CAS: ${casNumber}). Focus on: 1. Primary Hazards, 2. PPE Requirements, 3. Storage Compatibility. Keep it professional and concise.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to perform AI risk assessment at this time.";
    }
  }

  async getComplianceAdvice(query: string, contextDocuments: string[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const augmentedPrompt = contextDocuments.length > 0 
      ? `Using the following internal protocols as context: ${contextDocuments.join('\n')}\n\nQuestion: ${query}`
      : query;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: augmentedPrompt,
        config: {
          systemInstruction: "You are a professional safety and environmental compliance officer (ISO 14001 & OSHA expert)."
        }
      });
      return response.text;
    } catch (error) {
      return "Compliance assistant is offline.";
    }
  }

  /**
   * Chat with a specific PDF document (SDS/MSDS)
   */
  async chatWithDocument(pdfBase64: string, userMessage: string, history: {role: 'user'|'model', text: string}[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Cleanup base64 prefix if present
    const cleanBase64 = pdfBase64.split(',')[1] || pdfBase64;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        // Fix: Use the recommended structure for multi-part contents
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: cleanBase64
              }
            },
            {
              text: `You are an expert Toxicologist and Safety Engineer. Analyze the attached Safety Data Sheet (SDS). 
                       Reference specific sections (1-16) in your answer. 
                       History: ${JSON.stringify(history)}
                       User Question: ${userMessage}`
            }
          ]
        }
      });
      return response.text;
    } catch (error) {
      console.error("SDS Chat Error:", error);
      return "I encountered an error analyzing the document. Please ensure the PDF is valid and not password protected.";
    }
  }

  // --- Future Ollama (Local AI) Integration Stubs ---
  async callOllama(prompt: string, endpoint: string = 'http://localhost:11434') {
    console.log(`Routing request to Ollama @ ${endpoint}`);
    return "Ollama integration: Request received. (Awaiting real connection)";
  }

  // --- Vector DB & Embedding Stubs ---
  async embedDocument(text: string) {
    console.log("Generating vector embeddings for RAG knowledge base...");
    return new Array(768).fill(0).map(() => Math.random());
  }

  async searchKnowledgeBase(query: string) {
    console.log("Searching Vector DB for relevant safety protocols...");
    return ["Standard Operating Procedure for Acid Spills (2024)", "Waste Disposal Manual Section 4"];
  }
}

export const aiHub = new AIServiceHub();
