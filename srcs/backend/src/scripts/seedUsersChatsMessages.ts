// prisma/seed.ts
import bcrypt from 'bcrypt';

import { UserRole, FileType } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

const avatars = [
  { fileName: 'holocene.png', mimeType: 'image/png' },
  { fileName: 'hershel.webp', mimeType: 'image/webp' },
  { fileName: 'kindred.png', mimeType: 'image/png' },
  { fileName: 'radian.png', mimeType: 'image/png' },
  { fileName: 'taxman.png', mimeType: 'image/png' },
  { fileName: 'virtue.png', mimeType: 'image/png' },
];

async function main() {
  const profilePhtotids = await prisma.file.findMany({
    select: {
      id: true,
    },
  });
  // USERS
  const users = await Promise.all([
    prisma.user.create({
      data: {
        // id: '11111111-1111-1111-1111-111111111111',
        type: UserRole.user,
        email: 'alex@example.com',
        firstName: 'Alex',
        lastName: 'Smith',
        passwordHash: await bcrypt.hash('t1', 12),
        pseudo: 'alex',
        birthdate: new Date('1995-05-15'),
        profilePhotoId: profilePhtotids[Math.floor(Math.random() * profilePhtotids.length)].id,
      },
    }),

    prisma.user.create({
      data: {
        // id: '22222222-2222-2222-2222-222222222222',
        type: UserRole.user,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Brown',
        passwordHash: await bcrypt.hash('t1', 12),
        pseudo: 'john',
        birthdate: new Date('1997-08-20'),
        profilePhotoId: profilePhtotids[Math.floor(Math.random() * profilePhtotids.length)].id,
      },
    }),

    prisma.user.create({
      data: {
        // id: '33333333-3333-3333-3333-333333333333',
        type: UserRole.user,
        email: 'emma@example.com',
        firstName: 'Emma',
        lastName: 'Wilson',
        passwordHash: await bcrypt.hash('t1', 12),
        pseudo: 'emma',
        birthdate: new Date('1998-02-10'),
        profilePhotoId: profilePhtotids[Math.floor(Math.random() * profilePhtotids.length)].id,
      },
    }),

    prisma.user.create({
      data: {
        // id: '44444444-4444-4444-4444-444444444444',
        type: UserRole.user,
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Taylor',
        passwordHash: await bcrypt.hash('t1', 12),
        pseudo: 'mike',
        birthdate: new Date('1994-11-03'),
        profilePhotoId: profilePhtotids[Math.floor(Math.random() * profilePhtotids.length)].id,
      },
    }),
  ]);

  const startTime = new Date('2026-08-30T10:00:00');
  // CHATS
  const chat1 = await prisma.chat.create({
    data: {
      // id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      createdAt: new Date(startTime.getTime() + 0 * 60 * 1000),
    },
  });

  const chat2 = await prisma.chat.create({
    data: {
      // id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
    },
  });

  const chat3 = await prisma.chat.create({
    data: {
      // id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
    },
  });

  const chat4 = await prisma.chat.create({
    data: {
      // id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
    },
  });

  // CHAT MEMBERS
  await prisma.chatMember.createMany({
    data: [
      // Alex <-> John
      {
        chatId: chat1.id,
        userId: users[0].id,
      },
      {
        chatId: chat1.id,
        userId: users[1].id,
      },

      // Alex <-> Emma
      {
        chatId: chat2.id,
        userId: users[0].id,
      },
      {
        chatId: chat2.id,
        userId: users[2].id,
      },

      // Alex <-> Mike
      {
        chatId: chat3.id,
        userId: users[0].id,
      },
      {
        chatId: chat3.id,
        userId: users[3].id,
      },

      // John <-> Emma
      {
        chatId: chat4.id,
        userId: users[1].id,
      },
      {
        chatId: chat4.id,
        userId: users[2].id,
      },
    ],
  });

  // MESSAGES
  await prisma.message.createMany({
    data: [
      // CHAT 1
      {
        chatId: chat1.id,
        senderId: users[0].id,
        content: 'Привет, John!',
        createdAt: new Date(startTime.getTime() + 0 * 60 * 1000),
      },
      {
        chatId: chat1.id,
        senderId: users[1].id,
        content: 'Привет, Alex! Как дела?',
        createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
      },
      {
        chatId: chat1.id,
        senderId: users[0].id,
        content: 'Всё отлично, спасибо!',
        createdAt: new Date(startTime.getTime() + 5 * 60 * 1000),
      },
      {
        chatId: chat1.id,
        senderId: users[1].id,
        content: 'Рад это слышать 🙂',
        createdAt: new Date(startTime.getTime() + 8 * 60 * 1000),
      },

      // CHAT 2
      {
        chatId: chat2.id,
        senderId: users[0].id,
        content: 'Привет Emma!',
        createdAt: new Date(startTime.getTime() + 0 * 60 * 1000),
      },
      {
        chatId: chat2.id,
        senderId: users[2].id,
        content: 'Привет Alex 👋',
        createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
      },
      {
        chatId: chat2.id,
        senderId: users[0].id,
        content: 'Что делаешь сегодня?',
        createdAt: new Date(startTime.getTime() + 5 * 60 * 1000),
      },
      {
        chatId: chat2.id,
        senderId: users[2].id,
        content: 'Пока планов нет.',
        createdAt: new Date(startTime.getTime() + 8 * 60 * 1000),
      },

      // CHAT 3
      {
        chatId: chat3.id,
        senderId: users[3].id,
        content: 'Ты уже посмотрел новый фильм?',
        createdAt: new Date(startTime.getTime() + 0 * 60 * 1000),
      },
      {
        chatId: chat3.id,
        senderId: users[0].id,
        content: 'Ещё нет.',
        createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
      },
      {
        chatId: chat3.id,
        senderId: users[3].id,
        content: 'Тогда обязательно посмотри!',
        createdAt: new Date(startTime.getTime() + 5 * 60 * 1000),
      },
      {
        chatId: chat3.id,
        senderId: users[0].id,
        content: 'Хорошо, посмотрю вечером.',
        createdAt: new Date(startTime.getTime() + 8 * 60 * 1000),
      },

      // CHAT 4
      {
        chatId: chat4.id,
        senderId: users[1].id,
        content: 'Emma, привет!',
        createdAt: new Date(startTime.getTime() + 0 * 60 * 1000),
      },
      {
        chatId: chat4.id,
        senderId: users[2].id,
        content: 'Привет John!',
        createdAt: new Date(startTime.getTime() + 2 * 60 * 1000),
      },
      {
        chatId: chat4.id,
        senderId: users[1].id,
        content: 'Есть новости по проекту?',
        createdAt: new Date(startTime.getTime() + 5 * 60 * 1000),
      },
      {
        chatId: chat4.id,
        senderId: users[2].id,
        content: 'Да, скоро всё расскажу.',
        createdAt: new Date(startTime.getTime() + 8 * 60 * 1000),
      },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
