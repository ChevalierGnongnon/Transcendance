
import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PrismaClient,
    UserRole,
    AiMessageRole,
} from "../src/generated/prisma/client";
import { randomUUID } from "node:crypto";

const adapter = new PrismaMariaDb({
    host: "127.0.0.1",
    port: 3307,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Creating analytics mock data...");

    // 1. Create or find two test users
    const user = await prisma.user.upsert({
        where: { email: "analytics@test.com" },
        update: {},
        create: {
            type: UserRole.user,
            email: "analytics@test.com",
            firstName: "Analytics",
            lastName: "Test",
            passwordHash: "mock-password-hash",
            pseudo: "analytics_test",
            birthdate: new Date("1995-01-01"),
        },
    });

    const opponent = await prisma.user.upsert({
        where: { email: "analytics-opponent@test.com" },
        update: {},
        create: {
            type: UserRole.user,
            email: "analytics-opponent@test.com",
            firstName: "Analytics",
            lastName: "Opponent",
            passwordHash: "mock-password-hash",
            pseudo: "analytics_opponent",
            birthdate: new Date("1994-01-01"),
        },
    });

    console.log(`Analytics user: ${user.email}`);
    console.log(`Opponent user: ${opponent.email}`);

    // 2. Remove old analytics data for this user
    await prisma.aiUsage.deleteMany({
        where: { userId: user.id },
    });

    await prisma.aiMessage.deleteMany({
        where: {
            conversation: { userId: user.id },
        },
    });

    await prisma.aiConversation.deleteMany({
        where: { userId: user.id },
    });

    // A game belongs to two players, not to a single userId.
    await prisma.game.deleteMany({
        where: {
            OR: [
                { playerXId: user.id },
                { playerOId: user.id },
            ],
        },
    });

    console.log("Old analytics data removed.");

    // 3. Create 100 games with realistic outcomes
    const gamesToCreate = 100;
    const gamesWon = 63;
    const gamesLost = 27;
    const gamesDrawn = 10;

    for (let i = 0; i < gamesToCreate; i++) {
        const createdAt = randomDateForLast30Days();

        let winnerId: string | null = null;
        let isDraw = false;

        if (i < gamesWon) {
            winnerId = user.id;
        } else if (i < gamesWon + gamesLost) {
            winnerId = opponent.id;
        } else {
            isDraw = true;
        }

        await prisma.game.create({
            data: {
                invitationId: randomUUID(),
                boardSize: 15,
                playerXId: user.id,
                playerOId: opponent.id,
                currentTurnUserId: user.id,
                board: createEmptyBoard(15),
                winnerId,
                isDraw,
                winningLine: [],
                createdAt,
                updatedAt: createdAt,
                closedAt: createdAt,
            },
        });
    }

    console.log(
        `Games created: ${gamesToCreate} ` +
        `(${gamesWon} won, ${gamesLost} lost, ${gamesDrawn} drawn).`
    );

    // 4. Create AI conversations
    const conversationTitles = [
        "First conversation",
        "Learning TypeScript",
        "Prisma questions",
        "Game ideas",
        "Random questions",
    ];

    const conversations = [];

    for (const title of conversationTitles) {
        const conversation = await prisma.aiConversation.create({
            data: {
                userId: user.id,
                title,
            },
        });

        conversations.push(conversation);
    }

    console.log(`${conversations.length} conversations created.`);

    // 5. Create AI usage for the last 30 days
    for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        date.setHours(12, 0, 0, 0);

        const requests = randomNumber(1, 5);

        for (let request = 0; request < requests; request++) {
            const conversation =
                conversations[
                    randomNumber(0, conversations.length - 1)
                ];

            const inputTokens = randomNumber(50, 300);
            const outputTokens = randomNumber(100, 700);
            const thinkingTokens = randomNumber(100, 1000);

            const totalTokens =
                inputTokens + outputTokens + thinkingTokens;

            await prisma.aiUsage.create({
                data: {
                    userId: user.id,
                    conversationId: conversation.id,
                    inputTokens,
                    outputTokens,
                    thinkingTokens,
                    totalTokens,
                    createdAt: randomDateForDay(date),
                },
            });
        }
    }

    console.log("AI usage data created.");

    // 6. Create sample messages
    for (const conversation of conversations) {
        await prisma.aiMessage.createMany({
            data: [
                {
                    conversationId: conversation.id,
                    role: AiMessageRole.user,
                    content: "Hello, can you help me?",
                },
                {
                    conversationId: conversation.id,
                    role: AiMessageRole.assistant,
                    content: "Of course! How can I help you?",
                },
            ],
        });
    }

    console.log("AI messages created.");

    // 7. Summary
    console.log("\nMock data successfully created!");
    console.log("--------------------------------");
    console.log(`User: ${user.email}`);
    console.log(`Games won: ${gamesWon}`);
    console.log(`Games lost: ${gamesLost}`);
    console.log(`Games drawn: ${gamesDrawn}`);
    console.log(`Games played: ${gamesToCreate}`);
    console.log(`User ID: ${user.id}`);
    console.log("--------------------------------");
}

function createEmptyBoard(size: number): (string | null)[][] {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
    );
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateForDay(day: Date): Date {
    const date = new Date(day);

    date.setHours(
        randomNumber(8, 22),
        randomNumber(0, 59),
        randomNumber(0, 59),
        0
    );

    return date;
}

function randomDateForLast30Days(): Date {
    const date = new Date();

    date.setDate(date.getDate() - randomNumber(0, 29));

    date.setHours(
        randomNumber(8, 22),
        randomNumber(0, 59),
        randomNumber(0, 59),
        0
    );

    return date;
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
