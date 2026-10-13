import { AiMessageRole } from "../../generated/prisma/enums.ts";

export interface ChatMessage {
    role: AiMessageRole;
    content: string;
}

export interface AiUsageData {
    inputTokens: number;
    outputTokens: number;
    thinkingTokens: number;
    totalTokens: number;
}