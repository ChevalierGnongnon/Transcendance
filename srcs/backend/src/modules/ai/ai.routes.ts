import { Router} from "express";
import { chatbot, createConversation, getConversationMessages } from "./ai.controllers.ts";
import { validateChatRequest } from "./ai.validators.ts";
import { aiRateLimiter, checkConversationOwnership, notifyAiRateLimit } from "./ai.middlewares.ts";
import { requireAuth } from "../auth/auth.middlewares.ts";

const router = Router(); 

router.post("/ai/conversations", requireAuth, createConversation)
router.post("/chatbot", requireAuth, validateChatRequest, checkConversationOwnership, aiRateLimiter, notifyAiRateLimit, chatbot);
router.get("/ai/conversations/:conversationId/messages",requireAuth,getConversationMessages);

export default router; 