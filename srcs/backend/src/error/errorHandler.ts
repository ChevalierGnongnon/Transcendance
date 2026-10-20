import type {Request, Response, NextFunction } from "express";
import { AppError } from "./../error/AppError.ts";

export function errorHandler(error: unknown, req: Request, res: Response, next:NextFunction)
{
    console.error(error); 
    if(res.headersSent)
        return(next(error));

    if (error instanceof AppError)
        return res.status(error.statusCode).json({error: error.message});

    res.status(500).json({error: "Internal Server error"});
}