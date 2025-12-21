
import { GoogleGenAI, Type } from "@google/genai";

export const generateDescription = async (itemName: string, category: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, mouth-watering, professional menu description for an Afghan dish called "${itemName}" in the category "${category}". Keep it under 150 characters. Mention traditional Afghan spices.`,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });
    
    return response.text?.trim() || "Delicious Afghan specialty prepared with traditional spices.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Expertly prepared using authentic ingredients and traditional Afghan techniques.";
  }
};

export const suggestPrice = async (itemName: string, category: string): Promise<number> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a typical US restaurant price for an Afghan dish called "${itemName}" in the category "${category}". Return only a number.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER }
          },
          required: ["price"]
        }
      }
    });
    
    const data = JSON.parse(response.text || '{"price": 15.00}');
    return data.price || 15.00;
  } catch (error) {
    return 15.95;
  }
};
