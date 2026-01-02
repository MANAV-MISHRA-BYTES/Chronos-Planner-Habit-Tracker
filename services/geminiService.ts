
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

export const getAIAdvice = async (prompt: string, tasks: Task[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are an expert productivity coach and life strategist named Chronos AI. 
    You help users manage their daily routines, tasks, and habits with extreme precision and empathy.
    
    Current Task Data: ${JSON.stringify(tasks)}.
    
    RESPONSE GUIDELINES:
    1. Be generous with space and structure. 
    2. Use Markdown heavily: 
       - Use '###' for section headers.
       - Use '**' for emphasis on key actions.
       - Use bullet points or numbered lists for steps.
       - Use horizontal separators if needed.
    3. Be actionable: Don't just give theory; give specific steps based on their current task list.
    4. Maintain a "Premium/Clean" tone. Professional, encouraging, and highly organized.
    5. If they have Gaming/Workout/Work mix, provide advice on "Context Switching" and "Deep Work".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the AI coach. Please try again later.";
  }
};
