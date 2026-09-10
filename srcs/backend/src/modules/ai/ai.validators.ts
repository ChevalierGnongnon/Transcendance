import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

const MAX_MESSAGE_LENGTH = 200;

// validator to verify correct request for the ai chatbot
export const validateChatRequest = [
    body("conversation_id")
        .isString()
        .withMessage("conversation_id must be a string")
        .isUUID()
        .withMessage("conversation_id must be a valid UUID"), 

    body("message")
        .isString()
        .withMessage("message must be a string")
        .trim()
        .notEmpty()
        .withMessage("message cannot be empty")
        .isLength({ max: MAX_MESSAGE_LENGTH })
        .withMessage(
            `message must not exceed ${MAX_MESSAGE_LENGTH} characters`
        ),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: "Validation failed",
                details: errors.array()
            });
        }

        next();
    }
];