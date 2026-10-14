import dotenv from "dotenv";

dotenv.config({
    path: "../secrets/.env",
});

import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { UserRole } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";

const TEST_EMAIL = "testdata@example.com";
const TEST_PSEUDO = "testdata";
const TEST_PASSWORD = "testdata123";

const OPPONENT_EMAIL = "testdata-opponent@example.com";
const OPPONENT_PSEUDO = "testdata_opponent";

const BOARD_SIZE = 15;

async function main() {
    console.log("Creating analytics test data...");

    /*
     * 1. Vorhandenen Testuser finden und löschen
     *
     * Achtung: Löschen kann abhängige Daten entfernen.
     * Nur in der Entwicklungsdatenbank verwenden.
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
     * 2. Vorhandenen Gegner finden und löschen
     */
    const existingOpponent = await prisma.user.findFirst({
        where: {
            OR: [
                { email: OPPONENT_EMAIL },
                { pseudo: OPPONENT_PSEUDO },
            ],
        },
    });

    if (existingOpponent) {
        console.log("Existing opponent found. Deleting...");

        await prisma.user.delete({
            where: {
                id: existingOpponent.id,
            },
        });
    }

    /*
     * 3. Passwort hashen
     *
     * bcrypt mit 12 Runden, wie in der bisherigen Datei.
     */
    const passwordHash = await bcrypt.hash(
        TEST_PASSWORD,
        12
    );

    /*
     * 4. Zentralen Testuser erstellen
     */
    const user = await prisma.user.create({
        data: {
            type: UserRole.user,
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
     * 5. Zweiten User für die Spiele erstellen
     */
    const opponentPasswordHash = await bcrypt.hash(
        randomUUID(),
        12
    );

    const opponent = await prisma.user.create({
        data: {
            type: UserRole.user,
            email: OPPONENT_EMAIL,
            pseudo: OPPONENT_PSEUDO,
            firstName: "Test",
            lastName: "Opponent",
            passwordHash: opponentPasswordHash,
            birthdate: new Date("1999-01-01"),
        },
    });

    console.log(`Created opponent: ${opponent.pseudo}`);

    /*
     * 6. AI-Konversationen erstellen
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
     * 7. Historische AI-Nutzung erzeugen
     *
     * Ungefähr sechs Monate, 1–5 Requests pro Tag.
     */
    const aiUsageData = [];
    const today = new Date();

    for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
        const date = new Date(today);

        date.setDate(today.getDate() - daysAgo);

        const requestsPerDay =
            1 + Math.floor(Math.random() * 5);

        for (
            let request = 0;
            request < requestsPerDay;
            request++
        ) {
            const createdAt = new Date(date);

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
                        Math.random() * conversations.length
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
     * 8. Historische Spiele nach dem neuen Game-Modell erzeugen
     *
     * winnerId = user.id       -> Sieg des Testusers
     * winnerId = opponent.id   -> Niederlage des Testusers
     * isDraw = true            -> Unentschieden
     *
     * Spiele ohne Ergebnis werden nicht erzeugt.
     */
    const gameData = [];

    for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
        const date = new Date(today);

        date.setDate(today.getDate() - daysAgo);

        // Nicht an jedem Tag müssen Spiele stattfinden.
        const gamesPerDay =
            Math.floor(Math.random() * 5);

        for (
            let gameIndex = 0;
            gameIndex < gamesPerDay;
            gameIndex++
        ) {
            const createdAt = new Date(date);

            createdAt.setHours(
                10 + Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 60),
                0,
                0
            );

            // 55 % Siege, 35 % Niederlagen, 10 % Unentschieden
            const result = Math.random();

            let winnerId: string | null = null;
            let isDraw = false;

            if (result < 0.55) {
                winnerId = user.id;
            } else if (result < 0.90) {
                winnerId = opponent.id;
            } else {
                isDraw = true;
            }

            gameData.push({
                invitationId: randomUUID(),
                boardSize: BOARD_SIZE,
                playerXId: user.id,
                playerOId: opponent.id,
                currentTurnUserId: user.id,
                board: createEmptyBoard(BOARD_SIZE),
                winnerId,
                isDraw,
                winningLine: [],
                createdAt,
                updatedAt: createdAt,
                closedAt: createdAt,
            });
        }
    }

    await prisma.game.createMany({
        data: gameData,
    });

    const gamesWon = gameData.filter(
        (game) => game.winnerId === user.id
    ).length;

    const gamesLost = gameData.filter(
        (game) => game.winnerId === opponent.id
    ).length;

    const gamesDrawn = gameData.filter(
        (game) => game.isDraw
    ).length;

    console.log(`Created ${gameData.length} games.`);
    console.log(`Wins: ${gamesWon}`);
    console.log(`Losses: ${gamesLost}`);
    console.log(`Draws: ${gamesDrawn}`);

    /*
     * 9. Zusammenfassung
     */
    console.log("");
    console.log("Analytics seed completed!");
    console.log("");
    console.log("Login:");
    console.log(`Pseudo: ${TEST_PSEUDO}`);
    console.log(`Password: ${TEST_PASSWORD}`);
}

function createEmptyBoard(
    size: number
): (string | null)[][] {
    return Array.from(
        { length: size },
        () => Array<string | null>(size).fill(null)
    );
}

main()
    .catch((error) => {
        console.error("Analytics seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
