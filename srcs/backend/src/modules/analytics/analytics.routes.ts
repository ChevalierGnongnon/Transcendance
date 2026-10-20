import express from "express";

import { getAnalyticsController } from "./analytics.controller.ts";
import { analyticsValidator } from "./analytics.validator.ts";
import { validate, requireAuth } from "../auth/auth.middlewares.js";

const router = express.Router();

router.get(
    "/analytics",
    requireAuth,
    analyticsValidator,
    validate,
    getAnalyticsController
);

export default router;