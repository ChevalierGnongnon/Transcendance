import type{ Request, Response } from "express"; 
import { getAnalytics } from "./analytics.service.ts";

/**
 * Main analytics controller, handles HTTP req and reponse by giving it to the service.  
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAnalyticsController(req: Request, res: Response)
{
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                error: "UNAUTHORIZED",
            });
        }

        const from = new Date(req.query.from as string);
        const to = new Date(req.query.to as string);

        to.setHours(23, 59, 59, 999);

        const analytics = await getAnalytics(userId, from, to);

        return res.status(200).json(analytics);
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to fetch analytics"
        });
    }
}