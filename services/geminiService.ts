
/**
 * ============================================================================
 * FILE: services/geminiService.ts
 * PURPOSE: NLP-based task parsing using Google Gemini API.
 * RESPONSIBILITY: Transforms free-text user input into structured task data.
 * DEPENDENCIES: @google/genai, types.ts
 * ============================================================================
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Priority, Recurrence } from "../types";
import { sanitize } from "../constants";

/**
 * Initialize the Google Generative AI client using the provided environment key.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * parseTaskInput
 * Uses Gemini-3-Flash-Preview to extract metadata from natural language strings.
 * 
 * INPUT: Raw string from the user.
 * OUTPUT: Structured task properties (title, priority, date, time, recurrence).
 * 
 * Logic utilizes the responseSchema feature of Gemini to enforce strict JSON structure.
 */
export async function parseTaskInput(input: string): Promise<{
  title: string;
  priority: Priority;
  date: string | null;
  time: string | null;
  recurrence: Recurrence;
}> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse this task string into a structured JSON object: "${input}"
      Current reference date: ${new Date().toISOString()}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            priority: { 
              type: Type.STRING, 
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Default to MEDIUM unless implied' 
            },
            date: { 
              type: Type.STRING, 
              description: 'ISO Date YYYY-MM-DD or null' 
            },
            time: { 
              type: Type.STRING, 
              description: 'HH:mm format or null' 
            },
            recurrence: { 
              type: Type.STRING, 
              enum: ['NONE', 'DAILY', 'WEEKDAYS', 'WEEKLY', 'MONTHLY'],
              description: 'NONE by default' 
            },
          },
          required: ['title', 'priority', 'recurrence']
        }
      }
    });

    /**
     * Parse the AI response. Gemini is instructed to return only the JSON payload.
     * We strip markdown fences (```json ... ```) just in case the model wraps it.
     */
    const cleanText = response.text ? response.text.replace(/```json|```/g, '').trim() : "{}";
    const parsed = JSON.parse(cleanText);
    
    // Explicit sanitization of LLM output to prevent string "null" from entering state
    return {
      title: sanitize(parsed.title) || input, // Fallback to input if title is somehow nullified
      priority: (parsed.priority as Priority) || Priority.MEDIUM,
      date: sanitize(parsed.date),
      time: sanitize(parsed.time),
      recurrence: (parsed.recurrence as Recurrence) || Recurrence.NONE,
    };
  } catch (error) {
    /**
     * Fallback mechanism: If AI parsing fails (network error, quota, or invalid format),
     * we return a safe default object based on the raw input string.
     */
    console.error("NLP Parsing failed:", error);
    return {
      title: input,
      priority: Priority.MEDIUM,
      date: null,
      time: null,
      recurrence: Recurrence.NONE,
    };
  }
}
