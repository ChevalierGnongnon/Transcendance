import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb({
    host: "127.0.0.1",
    port: 3307,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const user = await prisma.user.create({
        data: {
            type: UserRole.user,
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            passwordHash: "test-password-hash",
            pseudo: "testuser",
            birthdate: new Date("1995-01-01"),
        },
    });

    const conversation = await prisma.aiConversation.create({
        data: {
            userId: user.id,
            title: "Test Conversation",
        },
    });

    console.log("Created user:", user);
    console.log("Created conversation:", conversation);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });