import rateLimit, { type RateLimitInfo } from "express-rate-limit";
import type { Request,Response, NextFunction} from "express";
import { prisma } from '../../lib/prisma.js';
import { AppError } from "../../error/AppError.ts";

type RateLimitRequest = Request & {
    rateLimit: RateLimitInfo;
};
// --------------------------------------------------
// Rate Limiter
// 3 Requests per hour per authenticated user
// --------------------------------------------------

export const aiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,

    keyGenerator: (req: Request) => {
        if (!req.userId) {
            throw new Error("req.userId is missing");
        }
        return req.userId;
    },

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        error: "Too many AI requests. Please try again later."
    },

    handler: (req, res) => {
        const rateLimitInfo = (req as RateLimitRequest).rateLimit;
        const resetTime = rateLimitInfo.resetTime;

        if (resetTime) {
        const retryAfterSeconds = Math.max(
            0,
            Math.ceil(
                (resetTime.getTime() - Date.now()) / 1000
            )
        );

        res.setHeader("Retry-After", retryAfterSeconds);
    }
        res.status(429).json({
            error: "Too many Ai requests. Please try again later."
        });
    }
});


// --------------------------------------------------
// Conversation Ownership
// --------------------------------------------------

export async function checkConversationOwnership(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const conversationId = req.body.conversation_id;
    const userId = req.userId;

    // Authentication should already have happened
    if (!userId) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    // Find conversation
    const conversation =
        await prisma.aiConversation.findUnique({
            where: {
                id: conversationId
            },

            select: {
                id: true,
                userId: true
            }
        });

    // Conversation does not exist
    if (!conversation) {
        throw new AppError(
            "Conversation not found",
            404
        );
    }

    // Conversation belongs to another user
    if (conversation.userId !== userId) {
        throw new AppError(
            "You do not have access to this conversation",
            403
        );
    }

    // User owns conversation
    next();
}