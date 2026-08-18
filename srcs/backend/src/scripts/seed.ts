import fs from 'fs'
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { RowDataPacket } from 'mysql2';

import  database from '../config/db-connexion'


const avatars = [
	{ fileName: "holocene.png", mimeType: "image/png" },
	{ fileName: "hershel.webp", mimeType: "image/webp" },
	{ fileName: "kindred.png", mimeType: "image/png" },
	{ fileName: "radian.png", mimeType: "image/png" },
	{ fileName: "taxman.png", mimeType: "image/png" },
	{ fileName: "virtue.png", mimeType: "image/png" },
];

const admin = {
	email: "adm@transcendance.local",
	lastName: "admin",
	name: "transcendance",
	pseudo: "ico",
	profilePhotoId: null,
	birthdate: new Date("2001-01-01"),
	gamesPlayed: 999,
	gamesWon: 999,
	gamesLost: 999,
	personalBest: 999,
	accountType: "admin",
};

const profilePhoto = {
	id: "3ecc845f-7e97-4e9b-b01e-cce149e518c3",
	name: "3ecc845f-7e97-4e9b-b01e-cce149e518c3.webp",
	type: "profile_photo",
    mimeType: "image/webp",
};


const passwordFile = process.env.ADMIN_PASSWORD_FILE;

if (!passwordFile) {
  throw new Error("ADMIN_PASSWORD_FILE is not set");
}

const password = fs.readFileSync(passwordFile, "utf8").trim();
const passwordHash = await bcrypt.hash(password, 12);

async function seed() {
	try {
		const [adminRows] = await database.promise().query<RowDataPacket[]>(
			`
			SELECT account_id
			FROM account
			WHERE email = ?
			`,
			[
				admin.email
			]
		);

		let adminId: string;

		if (adminRows.length > 0) {
			adminId = adminRows[0].account_id;
			console.log("Admin already exists");
		} else {
			
			adminId = crypto.randomUUID();

			await database.promise().query(
				`
				INSERT INTO account (
					account_id,
					account_type,
					name,
					last_name,
					email,
					password_hash,
					birthdate,
					pseudo,
					profile_photo_id,
					games_played,
					games_won,
					games_lost,
					personal_best
				) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				`,
				[
					adminId,
					admin.accountType,
					admin.name,
					admin.lastName,
					admin.email,
					passwordHash,
					admin.birthdate,
					admin.pseudo,
					admin.profilePhoto,
					admin.gamesPlayed,
					admin.gamesWon,
					admin.gamesLost,
					admin.personalBest
				]
			);

			await database.promise().query(
				`
				INSERT INTO file (
					file_id,
					file_name,
					type,
					uploader_id,
					mime_type
				)
				VALUES (?, ?, ?, ?, ?)
				`, 
				[
					profilePhoto.id,
					profilePhoto.name,
					profilePhoto.type,
					adminId,
					profilePhoto.mimeType,
				] 
			);

			
			console.log("Admin created");
		}

		if (!adminId) {
			throw new Error("Admin ID was not created");
		}

		
		for (const avatar of avatars) {
			const [existingAvatar] = await database.promise().query<RowDataPacket[]>(
				`
				SELECT file_id
				FROM file
				WHERE type = ?
					AND file_name = ?
				LIMIT 1
				`,
				[
					"default_avatar",
					avatar.fileName
				]
			);
			if (existingAvatar.length > 0) {
				console.log(`Avatar ${avatar.fileName} already exists`);
				continue;
			}

			const fileId = crypto.randomUUID();
			
			await database.promise().query(
				`
				INSERT INTO file (
					file_id,
					file_name,
					type,
					uploader_id,
					mime_type
				)
				VALUES (?, ?, ?, ?, ?)
				`,
				[
					fileId,
					avatar.fileName,
					'default_avatar',
					adminId,
					avatar.mimeType,
				]
			);

			console.log(`Avatar ${avatar.fileName} created`);

		}

		console.log("Seed completed successfully");
	} catch (error) {
		console.error("Seed failed:", error);
    	process.exitCode = 1;
	} finally {
		await database.end();
		console.log("Databae connection closed");
	}
}

seed().catch((error) => {
  console.error("Unexpected seed error:", error);
  process.exitCode = 1;
});
