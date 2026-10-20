import { prisma } from '../../lib/prisma.js';
import { generateResponseStream } from "./gemini.service.ts";
import type{ AiUsageData } from "./ai.types.ts";
import { emitAnalyticsUpdated, emitAiMessageCreated } from '../socket/socket-events.ts';


/**
 * Main service function which loads Conversation history. 
 * saves user message and await the generated AI response 
 * @param userId 
 * @param conversationId 
 * @param message 
 */
export async function* streamChat(userId: string, conversationId: string, message: string) 
{
    // 1. Load previous conversation history
    const history = await prisma.aiMessage.findMany({
        where: {conversationId},
        orderBy: {createdAt: "asc"},
        select: {role: true, content: true}
    });

    // 2. Save user message
    await prisma.aiMessage.create({
        data: {
            conversationId,
            role: "user",
            content: message
        }
    });
    emitAiMessageCreated(userId, conversationId);

    // 3. Generate and stream AI response
    let fullResponse = "";
    let usage: AiUsageData | null = null;
    for await (const chunk of generateResponseStream(history,message,(metadata) => {usage = metadata;}))
    {
        // console.log('SERVICE CHUNK:', chunk);
        fullResponse += chunk;
        yield chunk;
    }

    // 4. Only save a non-empty assistant response
    if (fullResponse.trim() !== "")
        {
        await prisma.aiMessage.create({
            data: {
                conversationId,
                role: "assistant",
                content: fullResponse
            }
        });
    }
    emitAiMessageCreated(userId, conversationId);
    // 5. Save AI usage
    if (usage) {
        await storeAiUsage(userId, conversationId, usage);
        // console.log("AI USAGE SAVED");
    }
}

/**
 * Store a usage into the Database and update for sockets 
 * @param userId 
 * @param conversationId 
 * @param usage 
 */
export async function storeAiUsage(userId: string, conversationId: string, usage: AiUsageData) {
    await prisma.aiUsage.create({
        data: {
            userId,
            conversationId,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            thinkingTokens: usage.thinkingTokens,
            totalTokens: usage.totalTokens,
        },
    });
    emitAnalyticsUpdated(userId);
}