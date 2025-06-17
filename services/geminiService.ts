import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SUPPORTED_LANGUAGES, GEMINI_MODEL_NAME } from '../constants';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Base64 prefix (e.g., "data:audio/mpeg;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const transcribeAudio = async (
  file: File,
  languageCode: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error(
      "API key not configured. Please set API_KEY environment variable."
    );
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const base64Data = await convertFileToBase64(file);
    const mimeType = file.type;

    if (!mimeType.startsWith('audio/') && !mimeType.startsWith('video/')) {
        throw new Error('Unsupported file type. Please upload an audio or video file.');
    }
    
    // Max file size check (e.g., 40MB for base64 encoded data, roughly 30MB original file)
    if (base64Data.length > 40 * 1024 * 1024) { 
        throw new Error('File is too large. Please use files smaller than ~30MB.');
    }

    let textPrompt: string;

    if (languageCode === 'auto') {
      textPrompt = `Transcribe the audio from this file. Identify and transcribe all spoken languages accurately in their respective scripts. If multiple languages are present, transcribe each segment in its original language. Provide only the transcribed text, without any additional explanations or formatting.`;
    } else {
      const selectedLangObject = SUPPORTED_LANGUAGES.find(lang => lang.value === languageCode);
      const languageName = selectedLangObject ? selectedLangObject.label.split('(')[0].trim() : 'the specified language';
      textPrompt = `Transcribe the audio from this file into ${languageName} language. Provide only the transcribed text, without any additional explanations or formatting.`;
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: textPrompt,
    };
    
    const model = GEMINI_MODEL_NAME;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [audioPart, textPart] },
      // config: {
      //   // For transcription, default temperature might be best.
      //   // temperature: 0.2 // Lower temperature for more deterministic output
      // }
    });
    
    const transcription = response.text;
    if (!transcription || transcription.trim() === '') {
      // This could happen if the audio is silent or the model couldn't transcribe.
      return "No speech detected or transcription available for this audio.";
    }
    return transcription;

  } catch (error) {
    console.error("Gemini API error during transcription:", error);
    if (error instanceof Error) {
      // Check for specific Gemini error messages if available and customize
      if (error.message.includes("quota")) {
        throw new Error("API quota exceeded. Please try again later or check your API plan.");
      }
      if (error.message.includes("unsupported")) {
         throw new Error(`Transcription failed: Unsupported file type or content. Details: ${error.message}`);
      }
      throw new Error(`Transcription failed: ${error.message}`);
    }
    throw new Error("Transcription failed: An unknown error occurred with the AI service.");
  }
};