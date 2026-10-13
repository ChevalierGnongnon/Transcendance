import { prisma } from '../../lib/prisma.js';
import type { AnalyticsData, AnalyticsOverview, AiUsageOverTime, GamesOverTime, GamesSummary,} from "./analytics.types.ts";
// Business logic 
// Prisma request and calculations with the data to get total amount of games played etc. 

async function getGameStats(userId: string, from: Date, to: Date) 
{
    const won = await prisma.game.count({
        where: {
            userId, 
            result: "won",
            createdAt: {
                gte: from,
                lte: to,
            },
        }
    });
    const lost = await prisma.game.count({
        where: {
            userId, 
            result: "lost",
            createdAt: {
                gte: from,
                lte: to,
            },
        }
    });
    return {
        gamesWon: won,
        gamesLost: lost
    };
}

async function getAiUsage(userId: string, from: Date, to: Date) {
    return prisma.aiUsage.findMany({
        where: {
            userId,
            createdAt: {
                gte: from,
                lte: to,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

async function getOverview(userId: string, from: Date, to: Date): Promise<AnalyticsOverview>
{
    const gameStats = await getGameStats(userId, from, to);
    const gamesPlayed = gameStats.gamesWon + gameStats.gamesLost;
    const winRate = gamesPlayed > 0 ? (gameStats.gamesWon / gamesPlayed) * 100 : 0;

    // sum all aiUsage together 
    const aiUsage = await prisma.aiUsage.aggregate({
        where: {
            userId,
            createdAt: {
                gte: from,
                lte: to
            }
        },
        _count: true,
        _sum: {
            inputTokens: true,
            outputTokens: true,
            thinkingTokens: true,
            totalTokens: true
        }
    });

    return {
        gamesPlayed,
        gamesWon: gameStats.gamesWon,
        gamesLost: gameStats.gamesLost,
        winRate,

        aiRequests: aiUsage._count,
        inputTokens: aiUsage._sum.inputTokens ?? 0,
        outputTokens: aiUsage._sum.outputTokens ?? 0,
        thinkingTokens: aiUsage._sum.thinkingTokens ?? 0,
        totalTokens: aiUsage._sum.totalTokens ?? 0
    };
}

// Return an arry of games played at a given day 
async function getGamesOverTime(userId: string, from: Date, to: Date): Promise<GamesOverTime[]>
{
    const games = await prisma.game.findMany({
        where: {
            userId,
            createdAt: {
                gte: from,
                lte: to
            }
        },
        select: {
            result: true,
            createdAt: true
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    // group by date together how often we played 
    const grouped = new Map<string, GamesOverTime>();
    for (const game of games)
    {
        // create date as string and check if not already in our map
        const date = game.createdAt.toISOString().split("T")[0];
        if (!grouped.has(date))
        {  
            grouped.set(date, {
                date,
                played: 0,
                won: 0,
                lost: 0
            });
        }
        const stats = grouped.get(date)!;
        stats.played++;
        if (game.result=== "won")
            stats.won++;
        else 
            stats.lost++;
    }
    return Array.from(grouped.values())
}


async function getAiUsageOverTime(userId: string, from: Date, to: Date): Promise<AiUsageOverTime[]> 
{
    const aiUsage = await getAiUsage(userId, from, to); 
    const grouped = new Map<string, AiUsageOverTime>(); 

    for (const usage of aiUsage)
    {
        const date = usage.createdAt.toISOString().split("T")[0];
        if (!grouped.has(date))
        {
            grouped.set(date,{
                date,
                requests: 0,
                inputTokens: 0,
                outputTokens: 0,
                thinkingTokens: 0,
                totalTokens: 0,});
        }
        const stats = grouped.get(date)!; 
        stats.requests++;
        stats.inputTokens += usage.inputTokens; 
        stats.outputTokens += usage.outputTokens; 
        stats.thinkingTokens += usage.thinkingTokens; 
        stats.totalTokens += usage.totalTokens; 

    }
    return Array.from(grouped.values());
}

async function getGamesSummary(userId: string, from: Date, to: Date): Promise<GamesSummary> 
{
    const gameStats = await getGameStats(userId, from, to);

    return {
        won: gameStats.gamesWon,
        lost: gameStats.gamesLost,
    };
}

export async function getAnalytics(userId: string, from: Date, to: Date): Promise<AnalyticsData>
{
    const overview = await getOverview(userId, from, to);
    const aiUsageOverTime = await getAiUsageOverTime(userId, from, to); 
    const gamesOverTime = await getGamesOverTime(userId, from, to); 
    const gamesSummary = await getGamesSummary(userId, from, to); 
    
    return{overview, aiUsageOverTime, gamesOverTime, gamesSummary};
}