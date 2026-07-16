import  bcrypt from 'bcrypt';
import  crypto from 'crypto'
import  database from '../../src/config/db-connexion'
import fs from 'fs'
import { RowDataPacket } from 'mysql2';

const initAdmin = async() => {
    const emailAdmin = 'adm@transcendance.local';
    const adminUUID = crypto.randomUUID();
    const lastName = 'admin';
    const name = 'transcendance';
    const pseudo = 'ico';
    const profile_photo_id = null;
    const birthdate = new Date('2001-01-01');
    const gamesPlayed = 999;
    const gamesWon = 999;
    const gamesLost = 999;
    const personalBest = 999;
    const accountType = 'admin';
    const ppUUID = '3ecc845f-7e97-4e9b-b01e-cce149e518c3';
    const ppName = '3ecc845f-7e97-4e9b-b01e-cce149e518c3.webp';
    const ppType = 'profile_photo';
    const ppMimeType = 'image/webp';
    try{
        const [results] = await database.promise().query<RowDataPacket[]>(
            'SELECT account_id FROM account WHERE email = ?', [emailAdmin]
        );
        if (results.length > 0)
            return ;
        const pwd = fs.readFileSync('/run/secrets/admin_password', 'utf8').trim();
        const hashedPWD = await bcrypt.hash(pwd, 12);
        const [insertAdminResults] = await database.promise().query(
                'INSERT INTO account (account_id, account_type, name, last_name, email, password_hash, birthdate, pseudo, profile_photo_id, games_played, games_won, games_lost, personal_best) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [adminUUID, accountType, name, lastName, emailAdmin, hashedPWD, birthdate, pseudo, profile_photo_id, gamesPlayed, gamesWon, gamesLost, personalBest]
        );
        const [insertProfilePhotoResults] = await database.promise().query(
            'INSERT INTO file(file_id, file_name, type, uploader_id, mime_type) VALUES(?, ?, ?, ?, ?)' , 
            [ppUUID, ppName, ppType, adminUUID, ppMimeType] 
        );
        await database.promise().query(
            'UPDATE account SET profile_photo_id = ? WHERE account_id = ?',
            [ppUUID, adminUUID]
        );
    } catch (err){
        console.error('initAdmin failed:', err);
    }
    
}

export = initAdmin;