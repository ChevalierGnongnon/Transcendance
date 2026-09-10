import type { Request, Response } from "express";
import { streamChat } from "./ai.service.ts";
import { AppError } from "../../error/AppError.ts";
import { prisma } from "../../lib/prisma.ts";

// Create Conversation by clicking imaginary friend
export async function createConversation(req: Request, res: Response){
    const userId = req.userId;
    if(!userId)
        throw new AppError("User not authenticated", 401);

    const conversation = await prisma.aiConversation.create({
        data: {
            userId,
        },
        select: {
            id: true,
        },
    });
    res.status(201).json({
        conversationId: conversation.id,
    });
}


// Controller just gets the conversation_id and message and passes it to the service
export async function chatbot(req: Request, res: Response) {
    const {conversation_id, message} = req.body; 
    const userId = req.userId;
    if (!userId) 
         throw new AppError("User not authenticated", 401);

    try
    {
        const stream = streamChat(userId, conversation_id, message);
        // Write chunk by chunk of stream 
        for await (const chunk of stream)
        {
            console.log('AI CHUNK:', chunk);
            res.write(chunk)
        }
        res.end();
    } 
    catch (error)
{
    console.error("Streaming error:", error);

    if (error instanceof AppError && error.statusCode === 429)
    {
        if (res.headersSent)
        {
            res.end();
            return;
        }
        res.status(503).json({
            error: "AI provider rate limit exceeded."
        });
        return;
    }
    throw error;
}
}
