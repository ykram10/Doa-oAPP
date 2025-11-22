import { GoogleGenAI } from "@google/genai";
import { Donor } from "../types";

// Initialize the Gemini API client
// The API key is expected to be available in the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateThankYouMessage = async (donor: Donor): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a warm, professional, and empathetic thank you email for a clothing donation campaign.
      
      Donor Name: ${donor.fullName}
      Items Donated: ${donor.quantity} pieces of clothing
      
      The tone should be grateful and community-focused. Mention that their donation makes a real difference.
      Keep it concise (under 100 words).
      Format the output as a simple text body, no subject line needed.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Thank you for your generous donation!";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Thank you so much for your generous contribution to our clothing drive. Your support helps us make a difference!";
  }
};
