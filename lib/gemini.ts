import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/**
 * Generates course content based on the provided prompt using the Gemini AI model.
 *
 * @param prompt - The input string used to generate course content.
 * @returns A promise that resolves to the generated course content as a string.
 *
 * @remarks
 * This function utilizes the "gemini-2.0-flash" model to process the input prompt
 * and generate relevant content. If the response does not contain text, an empty
 * string is returned.
 */

export async function generateCourseContent(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text ?? "";
}