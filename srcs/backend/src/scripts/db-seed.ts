import { prisma } from '../lib/prisma.js';
import { UserRole, FileType } from '../generated/prisma/enums.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

const avatars = [
  { fileName: 'holocene.png', mimeType: 'image/png' },
  { fileName: 'hershel.webp', mimeType: 'image/webp' },
  { fileName: 'kindred.png', mimeType: 'image/png' },
  { fileName: 'radian.png', mimeType: 'image/png' },
  { fileName: 'taxman.png', mimeType: 'image/png' },
  { fileName: 'virtue.png', mimeType: 'image/png' },
];

const admin = {
  email: 'adm@transcendance.local',
  lastName: 'Admin',
  name: 'transcendance',
  pseudo: 'root',
  profilePhotoId: null,
  birthdate: new Date('2001-01-01'),
  accountType: UserRole.admin,
};

const passwordFile = process.env.ADMIN_PASSWORD_FILE;

if (!passwordFile) {
  throw new Error('ADMIN_PASSWORD_FILE is not set');
}

const password = fs.readFileSync(passwordFile, 'utf8').trim();
if (!password) {
  throw new Error('password for Admin is empty!');
}

async function main() {
  const userAdmin = await prisma.user.upsert({
    where: {
      email: admin.email,
    },
    update: {},
    create: {
      type: admin.accountType,
      email: admin.email,
      firstName: admin.name,
      lastName: admin.lastName,
      birthdate: admin.birthdate,
      passwordHash: await bcrypt.hash(password, 12),
      pseudo: admin.pseudo,
    },
  });

  console.log('Admin created!');

  await prisma.file.createMany({
    data: avatars.map((avatar) => ({
      name: avatar.fileName,
      userId: userAdmin.id,
      mimeType: avatar.mimeType,
      type: FileType.default_avatar,
    })),
    skipDuplicates: true,
  });

  console.log('Default avatars created!');

  const defaultAvatar = await prisma.file.findFirst({
    where: {
      type: FileType.default_avatar,
      userId: userAdmin?.id,
    },
  });

  await prisma.user.update({
    where: {
      id: userAdmin?.id,
    },
    data: {
      profilePhotoId: defaultAvatar?.id,
    },
  });

  console.log('profile photo updated for Admin');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
