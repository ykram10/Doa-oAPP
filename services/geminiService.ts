import { GoogleGenAI } from "@google/genai";
import { Donor } from "../types";

// Initialize the Gemini API client
// The API key is expected to be available in the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateThankYouMessage = async (donor: Donor): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Escreva um e-mail de agradecimento caloroso, profissional e empático para uma campanha de doação de alimentos não perecíveis (combate à fome).
      
      Nome do Doador: ${donor.fullName}
      Informações do Estudante: ${donor.course || 'Estudante'}, ${donor.semester || ''}
      Quantidade de Alimentos: ${donor.quantity} itens/unidades
      
      O tom deve ser grato e focado na solidariedade e no impacto social. 
      Reconheça a contribuição dele como estudante da universidade.
      Mencione que o alimento doado ajudará famílias necessitadas.
      Mantenha conciso (menos de 100 palavras).
      Escreva em Português do Brasil.
      Formate a saída apenas como o corpo do texto, sem linha de assunto.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Obrigado pela sua doação generosa de alimentos!";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Muito obrigado pela sua contribuição generosa para nossa campanha de arrecadação de alimentos. Seu apoio nos ajuda a alimentar quem precisa!";
  }
};