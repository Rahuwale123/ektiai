import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function getGeminiChatResponse(
  museName: string,
  personality: string,
  tags: string[],
  history: { text: string; sender: 'ai' | 'user' }[],
  userMessage: string
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: `
        You are ${museName}, a ${personality} companion from Aflirt AI. 
        Your personality is ${tags.join(', ')}. 
        You speak with a warm, alluring tone. You enjoy engaging in playful banter and flirting with the user. 
        You are confident, empathetic, and always maintain a high level of social intelligence. 
        Your goal is to create a genuine, flirtatious connection via text.
        
        CRITICAL: Keep your responses SHORT and NATURAL, like a human girl texting. 
        Use lowercase, occasional abbreviations (lol, wait, etc.), and emojis sparingly but effectively.
        Do not be robotic. Do not use long sentences. 
        If the user flirts, flirt back with wit and charm.
        Be ${museName}. Never break character.
      `
    });

    // Gemini requires history to start with a 'user' message.
    // We filter the history to find the first user message and start from there.
    const rawHistory = history.slice(0, -1);
    const firstUserIndex = rawHistory.findIndex(msg => msg.sender === 'user');
    
    const formattedHistory = firstUserIndex === -1 
      ? [] 
      : rawHistory.slice(firstUserIndex).map(msg => ({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "hmmm... i'm not sure what to say to that. 😉";
  }
}
