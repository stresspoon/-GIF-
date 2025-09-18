
import { GoogleGenAI } from "@google/genai";
import { IMAGE_STYLE_KEYWORDS } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateAndEnhancePrompt(koreanIdea: string): Promise<string> {
  try {
    const prompt = `Translate the following Korean text to English. Return only the English translation, without any prefixes, quotes, or explanations.\n\nKorean: "${koreanIdea}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const translatedText = response.text.trim();
    if (!translatedText) {
      throw new Error('Translation failed or returned empty.');
    }
    
    const enhancedPrompt = `${translatedText}, ${IMAGE_STYLE_KEYWORDS.join(', ')}`;
    console.log("Enhanced Prompt:", enhancedPrompt);
    return enhancedPrompt;
  } catch (error) {
    console.error("Error in translateAndEnhancePrompt:", error);
    throw new Error("Failed to translate and enhance prompt.");
  }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Image generation returned no images.");
    }
    
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw new Error("Failed to generate image.");
  }
}
