import { ApiError, GoogleGenAI } from "@google/genai";
import type { ChatMessage, AiUsageData } from "./ai.types.ts";
import { AppError } from "../../error/AppError.ts";
import { storeAiUsage } from "./ai.service.ts";

// Create a reusable Gemini API client using the API key
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// Convert application chat messages into the format expected by Gemini.
// Gemini uses "model" for AI responses, while our application uses "assistant".
function convertToGeminiHistory(history: ChatMessage[]) {
    return history.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
            {
                text: message.content
            }
        ]
    }));
}

//Generates an AI response using Gemini and streams the 
// * response back to the caller as individual text chunks.
export async function *generateResponseStream(history: ChatMessage[], message: string, onUsage: (usage: AiUsageData) => void) 
{
    const previousMessages = convertToGeminiHistory(history);
    const contents = [...previousMessages, {
        role: "user", 
        parts: [{text: message}]
        }   
    ];
    try 
    {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-3.6-flash",
            config: {
                systemInstruction: `
                Pretend to be my Imaginary friend.
                Always respond in plain text.
                Do not use Markdown.
                Do not use bold, italic, headings, bullet points, numbered lists,
                code blocks, or other Markdown formatting.
                `,
                },
            contents
        });
        let usageMetadata;
        for await(const chunk of responseStream)
        {
            let text;
            if (chunk.text === null || chunk.text === undefined)
                text = "";
            else
                text = chunk.text;
            console.log('GEMINI CHUNK:', text);
            if (chunk.usageMetadata)
               usageMetadata = chunk.usageMetadata;
            if (text)
                yield text;
         }
         // If usageMetadata exist callback function 
         if (usageMetadata) 
            {
                onUsage({
                inputTokens: usageMetadata.promptTokenCount ?? 0,
                outputTokens: usageMetadata.candidatesTokenCount ?? 0,
                thinkingTokens: usageMetadata.thoughtsTokenCount ?? 0,
                totalTokens: usageMetadata.totalTokenCount ?? 0,});
            }
    }
    catch (error)
    {
        console.error("Gemini error:", error);
        if (error instanceof ApiError)
        {
            if (error.status === 429)
                throw new AppError("AI provider rate limit exceeded", 429);
            if (error.status >= 500)
                throw new AppError("AI service Unavailable", 503);
            throw new AppError("AI request failed", 503);      
        }
        throw new AppError("AI service not availbale", 503);
    }  
}