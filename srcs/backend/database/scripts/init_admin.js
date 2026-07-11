const bcrypt = require('bcrypt');
const crypto = require('crypto');
const database = require('../../config/db-connexion.js');
const fs = require('fs');

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
    try{
        const [results] = await database.promise().query(
            'SELECT account_id FROM account WHERE email = ?', [emailAdmin]
        );
        if (results.length > 0)
            return ;
        const pwd = fs.readFileSync('/run/secrets/admin_password', 'utf8').trim();
        const hashedPWD = await bcrypt.hash(pwd, 12);
        const [insertResults] = await database.promise().query(
                'INSERT INTO account (account_id, account_type, name, last_name, email, password_hash, birthdate, pseudo, profile_photo_id, games_played, games_won, games_lost, personal_best) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [adminUUID, accountType, name, lastName, emailAdmin, hashedPWD, birthdate, pseudo, profile_photo_id, gamesPlayed, gamesWon, gamesLost, personalBest]
        );
    } catch (err){
        console.error('initAdmin failed:', err);
    }
    
}

module.exports = initAdmin;