import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PrismaClient,
    UserRole,
    AiMessageRole,
    GameResult,
} from "../src/generated/prisma/client";

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

    // --------------------------------------------------
    // 1. Create or reset test user
    // --------------------------------------------------

    const user = await prisma.user.upsert({
        where: {
            email: "analytics@test.com",
        },
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

    console.log(`User ready: ${user.email}`);

    // --------------------------------------------------
    // 2. Remove old test data
    // --------------------------------------------------

    await prisma.aiUsage.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prisma.aiConversation.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prisma.game.deleteMany({
        where: {
            userId: user.id,
        },
    });

    console.log("Old test data removed.");

    // --------------------------------------------------
    // 3. Create games
    // --------------------------------------------------

    const gamesToCreate = 100;
    const gamesWon = 63;
    const gamesLost = 37;

    for (let i = 0; i < gamesToCreate; i++) {
        const result =
            i < gamesWon
                ? GameResult.won
                : GameResult.lost;

        const createdAt = randomDateForLast30Days();

        await prisma.game.create({
            data: {
                userId: user.id,
                result,
                createdAt,
            },
        });
    }

    console.log(
        `${gamesToCreate} games created (${gamesWon} won, ${gamesLost} lost).`
    );

    // --------------------------------------------------
    // 4. Create conversations
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 5. Create AI usage data for the last 30 days
    // --------------------------------------------------

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
                inputTokens +
                outputTokens +
                thinkingTokens;

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

    // --------------------------------------------------
    // 6. Create messages
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 7. Summary
    // --------------------------------------------------

    console.log("\nMock data successfully created!");
    console.log("--------------------------------");
    console.log(`User: ${user.email}`);
    console.log(`Games won: ${gamesWon}`);
    console.log(`Games lost: ${gamesLost}`);
    console.log(`Games played: ${gamesToCreate}`);
    console.log("--------------------------------");
    console.log(`User ID: ${user.id}`);
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

    date.setDate(
        date.getDate() - randomNumber(0, 29)
    );

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