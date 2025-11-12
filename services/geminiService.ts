import { GoogleGenAI, Type } from "@google/genai";
import type { DiseaseAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        isHealthy: { 
            type: Type.BOOLEAN,
            description: "Is the leaf healthy? True if no disease is detected, false otherwise."
        },
        disease: { 
            type: Type.STRING,
            description: "The common name of the disease detected. If healthy, this should be 'Healthy'."
        },
        description: { 
            type: Type.STRING,
            description: "A brief, one to two sentence description of the disease or the healthy state of the plant."
        },
        symptoms: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "A list of key visual symptoms observed on the leaf."
        },
        possibleCauses: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of common causes for this disease (e.g., fungal infection, overwatering, pests)."
        },
        treatment: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "A list of actionable steps or treatments to manage the disease."
        },
        prevention: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "A list of preventative measures to avoid this disease in the future."
        }
    },
    required: ["isHealthy", "disease", "description", "symptoms", "possibleCauses", "treatment", "prevention"]
};

export async function analyzeLeafImage(base64Image: string, mimeType: string): Promise<DiseaseAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
          parts: [
              { text: "You are a specialized agricultural expert and botanist AI. Your task is to analyze the provided image of a plant leaf and identify any diseases. If no disease is present, confirm that the plant is healthy. Provide a detailed analysis based on the required JSON schema. Your response must be thorough and accurate." },
              {
                  inlineData: {
                      data: base64Image,
                      mimeType: mimeType,
                  },
              },
          ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    return parsedJson as DiseaseAnalysis;
  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The model may be unable to process this image.");
  }
}
