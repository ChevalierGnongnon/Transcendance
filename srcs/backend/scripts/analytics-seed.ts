import dotenv from "dotenv";

dotenv.config({
    path: "../secrets/.env",
});

import bcrypt from "bcrypt";
import { GameResult } from "../src/generated/prisma/enums.js";
import { prisma } from "../src/lib/prisma.js";

const TEST_EMAIL = "testdata@example.com";
const TEST_PSEUDO = "testdata";
const TEST_PASSWORD = "testdata123";

async function main() {
    console.log("Creating analytics test data...");

    /*
     * 1. Alten Testuser entfernen
     *
     * Dadurch ist der Seed bei jedem Durchlauf
     * reproduzierbar.
     */
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: TEST_EMAIL },
                { pseudo: TEST_PSEUDO },
            ],
        },
    });

    if (existingUser) {
        console.log("Existing test user found. Deleting...");

        await prisma.user.delete({
            where: {
                id: existingUser.id,
            },
        });
    }

    /*
     * 2. Passwort hashen
     *
     * Genau wie bei deiner normalen Registrierung.
     */
    const passwordHash = await bcrypt.hash(
        TEST_PASSWORD,
        12
    );

    /*
     * 3. Testuser erstellen
     */
    const user = await prisma.user.create({
        data: {
            email: TEST_EMAIL,
            pseudo: TEST_PSEUDO,
            firstName: "Test",
            lastName: "Data",
            passwordHash,
            birthdate: new Date("2000-01-01"),
        },
    });

    console.log(`Created user: ${user.pseudo}`);

    /*
     * 4. AI-Konversationen erstellen
     *
     * Die Analytics-Tabelle ai_usage benötigt
     * eine conversationId.
     */
    const conversations = await Promise.all(
        Array.from({ length: 5 }, (_, index) =>
            prisma.aiConversation.create({
                data: {
                    userId: user.id,
                    title: `Analytics Test Conversation ${index + 1}`,
                },
            })
        )
    );

    console.log(
        `Created ${conversations.length} AI conversations.`
    );

    /*
     * 5. Historische AI-Nutzung erzeugen
     *
     * Wir gehen ungefähr 6 Monate zurück.
     */
    const aiUsageData = [];

    const today = new Date();

    for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
        const date = new Date(today);

        date.setDate(
            today.getDate() - daysAgo
        );

        /*
         * Wir erzeugen zwischen 1 und 5
         * AI-Requests pro Tag.
         */
        const requestsPerDay =
            1 + Math.floor(Math.random() * 5);

        for (
            let request = 0;
            request < requestsPerDay;
            request++
        ) {
            const createdAt = new Date(date);

            /*
             * Verschiedene Uhrzeiten innerhalb
             * des Tages.
             */
            createdAt.setHours(
                8 + Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 60),
                0,
                0
            );

            const inputTokens =
                50 + Math.floor(Math.random() * 250);

            const outputTokens =
                20 + Math.floor(Math.random() * 150);

            const thinkingTokens =
                50 + Math.floor(Math.random() * 500);

            const totalTokens =
                inputTokens +
                outputTokens +
                thinkingTokens;

            const conversation =
                conversations[
                    Math.floor(
                        Math.random() *
                        conversations.length
                    )
                ];

            aiUsageData.push({
                userId: user.id,
                conversationId: conversation.id,
                inputTokens,
                outputTokens,
                thinkingTokens,
                totalTokens,
                createdAt,
            });
        }
    }

    await prisma.aiUsage.createMany({
        data: aiUsageData,
    });

    console.log(
        `Created ${aiUsageData.length} AI usage records.`
    );

    /*
     * 6. Historische Spiele erzeugen
     */
    const gameData = [];

    for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
        const date = new Date(today);

        date.setDate(
            today.getDate() - daysAgo
        );

        /*
         * Nicht jeden Tag müssen Spiele stattfinden.
         * Dadurch wird der Chart etwas realistischer.
         */
        const gamesPerDay =
            Math.floor(Math.random() * 5);

        for (
            let game = 0;
            game < gamesPerDay;
            game++
        ) {
            const createdAt = new Date(date);

            createdAt.setHours(
                10 + Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 60),
                0,
                0
            );

            const won =
                Math.random() < 0.55;

            gameData.push({
                userId: user.id,
                result: won ? GameResult.won : GameResult.lost,
                createdAt,
            });
        }
    }

    await prisma.game.createMany({
        data: gameData,
    });

    console.log(
        `Created ${gameData.length} games.`
    );

    console.log("");
    console.log("Analytics seed completed!");
    console.log("");
    console.log("Login:");
    console.log(`Pseudo: ${TEST_PSEUDO}`);
    console.log(`Password: ${TEST_PASSWORD}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });