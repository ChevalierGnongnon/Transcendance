import { Router} from "express";
import { chatbot, createConversation } from "./ai.controllers.ts";
import { validateChatRequest } from "./ai.validators.ts";
import { aiRateLimiter, checkConversationOwnership } from "./ai.middlewares.ts";
import { requireAuth } from "../auth/auth.middlewares.ts";

const router = Router(); 

router.post("/ai/conversations", requireAuth, createConversation)
router.post("/chatbot", requireAuth, aiRateLimiter, validateChatRequest, checkConversationOwnership, chatbot);


export default router; 