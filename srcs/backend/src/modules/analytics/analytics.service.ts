import { prisma } from '../../lib/prisma.js';
import type { AnalyticsData, AnalyticsOverview, AiUsageOverTime, GamesOverTime, GamesSummary,} from "./analytics.types.ts";
// Business logic 
// Prisma request and calculations with the data to get total amount of games played etc. 

/**
 * API for Game statistics 
 * @param userId 
 * @param from 
 * @param to 
 */
async function getGameStats(userId: string, from: Date, to: Date) {

    // funcrion to check if player was X or O
    const participationFilter = {
        OR: [
            { playerXId: userId },
            { playerOId: userId },
        ],
        createdAt: {
            gte: from,
            lte: to,
        },
    };

    // Check if game was one or draw
    const completedGameFilter = {
        AND: [
            participationFilter,
            {
                OR: [
                    { winnerId: { not: null } },
                    { isDraw: true },
                ],
            },
        ],
    };


    const [gamesPlayed, gamesWon, gamesLost, gamesDrawn] =
        await Promise.all([
            prisma.game.count({
                where: completedGameFilter,
            }),
            prisma.game.count({
                where: {
                    ...participationFilter,
                    winnerId: userId,
                },
            }),
            prisma.game.count({
                where: {
                    ...participationFilter,
                    winnerId: { not: null },
                    NOT: { winnerId: userId },
                },
            }),
            prisma.game.count({
                where: {
                    ...participationFilter,
                    isDraw: true,
                },
            }),
        ]);

    return {
        gamesPlayed,
        gamesWon,
        gamesLost,
        gamesDrawn,
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
    const gamesPlayed = gameStats.gamesPlayed;
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
        gamesDrawn: gameStats.gamesDrawn,
        gamesLost: gameStats.gamesLost,
        winRate,

        aiRequests: aiUsage._count,
        inputTokens: aiUsage._sum.inputTokens ?? 0,
        outputTokens: aiUsage._sum.outputTokens ?? 0,
        thinkingTokens: aiUsage._sum.thinkingTokens ?? 0,
        totalTokens: aiUsage._sum.totalTokens ?? 0
    };
}

// Return an array of games played at a given day 
async function getGamesOverTime(userId: string, from: Date, to: Date): Promise<GamesOverTime[]> 
{
    const games = await prisma.game.findMany({
        where: {
            OR: [
                { playerXId: userId },
                { playerOId: userId },
            ],
            createdAt: {
                gte: from,
                lte: to,
            },
        },
        select: {
            winnerId: true,
            isDraw: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const grouped = new Map<string, GamesOverTime>();

    for (const game of games) {
        // Nur Spiele mit Ergebnis berücksichtigen
        if (game.winnerId === null && !game.isDraw) continue;

        const date = game.createdAt.toISOString().split('T')[0];

        if (!grouped.has(date)) 
        {grouped.set(date, {
                date,
                played: 0,
                won: 0,
                lost: 0,
                drawn: 0,
            });
        }

        const stats = grouped.get(date)!;
        stats.played++;

        if (game.isDraw)
            stats.drawn++;
        else if (game.winnerId === userId)
            stats.won++;
        else if (game.winnerId !== null && !game.isDraw)
            stats.lost++;
    }

    return Array.from(grouped.values());
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
        drawn: gameStats.gamesDrawn,
    };
}

/**
 * Central Analytics service which get all data Summaries for further analysis  
 * @param userId 
 * @param from 
 * @param to 
 * @returns 
 */
export async function getAnalytics(userId: string, from: Date, to: Date): Promise<AnalyticsData>
{
    const overview = await getOverview(userId, from, to);
    const aiUsageOverTime = await getAiUsageOverTime(userId, from, to); 
    const gamesOverTime = await getGamesOverTime(userId, from, to); 
    const gamesSummary = await getGamesSummary(userId, from, to); 
    
    return{overview, aiUsageOverTime, gamesOverTime, gamesSummary};
}