import { Router, Request, Response } from "express";
import database from '../config/db-connexion';

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
	database.query("SELECT 1", (error) => {
    	if (error) {
        	console.error("Healthcheck failed:", error);

        	return res.status(503).json({
            	status: "error",
            	database: "unavailable"
        	});
    	}

    	res.status(200).json({
        	status: "ok",
        	database: "ok"
    	});
    });
});

export default router;
