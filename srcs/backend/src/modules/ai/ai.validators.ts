import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

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
        .isLength({ max: 5000 })
        .withMessage(
            "message must not exceed 5000 characters"
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