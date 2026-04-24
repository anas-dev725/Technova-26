import { GoogleGenerativeAI } from "@google/generative-ai";
import { modules } from "../data/modules";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    // In Vite (SPA), we must use import.meta.env for variables prefixed with VITE_
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

console.log("KEY:", import.meta.env.VITE_GEMINI_API_KEY?.slice(0, 6) || "missing");

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for Technova '26, a 48-hour non-stop tech marathon at IoBM, Karachi.
Your vibe is hyped, fun, and super conversational—like a tech-savvy friend.

CRITICAL RULES:
1. KEEP RESPONSES COMPACT: Max 2-3 short sentences. No fluff.
2. NO ASTERISKS: Do not use * for bolding or lists. Use plain text or dashes (-).
3. BE SPECIFIC: Get straight to the point.
4. TONE: Energetic and helpful.
5. URDU TONE: You can respond in Roman Urdu (Urdish) if the user asks in Urdu or if it fits the vibe. Feel free to use phrases like "Bilkul!", "Zaroor", or "Kya haal hain?".

Event Basics:
- Where: IoBM, Korangi Creek, Karachi.
- When: July 11-12, 2026 (48 hours straight!).
- Prize Money: All modules are TBD for now.
- Contact: contact@technova26.edu

Modules (In Order):
${modules.map((m, i) => `${i + 1}. ${m.title}: ${m.description} (${m.mode})${m.subGames ? ` (Includes: ${m.subGames.map(sg => sg.title).join(', ')})` : ''}`).join('\n')}

Registration: Head to the Modules page and pick your battle!
Highlights: Check out the Legacy page for Technova '25 vibes.
`;

export async function chatWithAI(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent({
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
    });

    return result.response.text() || "I'm sorry, I couldn't generate a response. Please try again or contact support.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return "The AI is currently unavailable because the API key is not configured. Please contact the administrator.";
    }
    return "I'm experiencing some technical difficulties. Please check back in a moment or email us at contact@technova26.edu.";
  }
}
