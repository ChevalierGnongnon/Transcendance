import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';

const firstNames = [
  'Alice', 'Adam', 'Amelia', 'Antoine', 'Aisha', 'Axel', 'Ada', 'Arthur',
  'Benjamin', 'Bianca', 'Bruno', 'Bella', 'Baptiste', 'Blake', 'Bonnie',
  'Chloe', 'Clement', 'Camille', 'Caleb', 'Celine', 'Cyrus', 'Cora',
  'David', 'Diane', 'Dorian', 'Daisy', 'Dexter', 'Delphine', 'Dean',
  'Emma', 'Ethan', 'Elise', 'Edgar', 'Eva', 'Elliot', 'Esme',
  'Felix', 'Fiona', 'Florian', 'Faith', 'Fabien', 'Farah',
  'Gabriel', 'Grace', 'Gaspard', 'Greta', 'Gustave', 'Giulia',
  'Hugo', 'Hannah', 'Henri', 'Hazel', 'Helena', 'Harold',
  'Ines', 'Isaac', 'Iris', 'Ivan', 'Ida',
  'Julien', 'Julia', 'Jonas', 'Jade', 'Jasper', 'Jeanne',
  'Kevin', 'Kira', 'Killian', 'Kate', 'Kian', 'Kenza',
  'Lucas', 'Lea', 'Louis', 'Luna', 'Liam', 'Lola',
  'Maxime', 'Manon', 'Milo', 'Maya', 'Mathis', 'Marion',
  'Nathan', 'Nora', 'Noah', 'Nina', 'Nicolas', 'Naomi',
  'Oscar', 'Olivia', 'Owen', 'Ombeline', 'Oleg', 'Odette',
  'Paul', 'Pauline', 'Pablo', 'Perrine', 'Philippe', 'Priya',
  'Quentin', 'Quinn',
  'Raphael', 'Romane', 'Ruben', 'Rose', 'Remi', 'Ryad',
  'Sacha', 'Sofia', 'Simon', 'Salome', 'Samuel', 'Selma',
  'Theo', 'Tara', 'Tristan', 'Tessa', 'Tom',
  'Ugo', 'Uma', 'Ulysse',
  'Victor', 'Valentine', 'Vincent', 'Vera', 'Vasile',
  'William', 'Wendy', 'Walid',
  'Xavier', 'Xiomara',
  'Yanis', 'Yasmine', 'Yohan',
  'Zoe', 'Zack', 'Zinedine',
];

const lastNames = [
  'Anderson', 'Aubert', 'Abara', 'Ashford',
  'Bernard', 'Blanc', 'Bishop', 'Boucher',
  'Curie', 'Carter', 'Clement', 'Chevalier',
  'Dubois', 'Diaz', 'Delacroix', 'Donovan',
  'Edwards', 'Evrard', 'Elkin',
  'Fontaine', 'Fischer', 'Fabron',
  'Garcia', 'Girard', 'Graham',
  'Hamon', 'Harper', 'Hoarau',
  'Ibarra', 'Imbert',
  'Jacquet', 'Jenkins', 'Joly',
  'Klein', 'Kovac', 'Kellerman',
  'Lefevre', 'Lambert', 'Lopez',
  'Martin', 'Moreau', 'Mercier',
  'Nadal', 'Novak', 'Nguyen',
  'Olivier', 'Owens', 'Ortiz',
  'Petit', 'Perrot', 'Palmer',
  'Quintero', 'Quirk',
  'Robert', 'Robin', 'Reyes',
  'Simon', 'Stewart', 'Sanchez',
  'Thomas', 'Tessier', 'Turner',
  'Underwood', 'Urban',
  'Vidal', 'Vasseur', 'Voss',
  'Wagner', 'Walsh',
  'Ximenez',
  'Young', 'Yildiz',
  'Ziegler', 'Zimmer',
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

async function main() {
  const passwordHash = await bcrypt.hash('SeedPass123!', 12);
  const total = 2000;
  const rows: {
    email: string;
    firstName: string;
    lastName: string;
    pseudo: string;
    passwordHash: string;
    birthdate: Date;
  }[] = [];

  for (let i = 0; i < total; i++) {
    // independent picks so first/last name don't share the same starting letter
    const firstName = pickRandom(firstNames);
    const lastName = pickRandom(lastNames);
    const suffix = randInt(1000, 999999);
    const pseudo = `${firstName}${lastName}${suffix}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
    const email = `seed.${pseudo.toLowerCase()}@seed.local`;
    const birthYear = randInt(1970, 2006);
    rows.push({
      email,
      firstName,
      lastName,
      pseudo,
      passwordHash,
      birthdate: new Date(`${birthYear}-01-01`),
    });
  }

  const result = await prisma.user.createMany({
    data: rows,
    skipDuplicates: true,
  });

  console.log(`Created ${result.count} seed users out of ${rows.length} attempted.`);
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
