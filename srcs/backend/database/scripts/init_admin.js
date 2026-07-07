const bcrypt = require('bcrypt');
const crypto = require('crypto');
const database = require('../../config/db-connexion.js');


const initAdmin = (req, res) => {
    const emailAdmin = 'adm@transcendance.local';
    const adminUUID = crypto.randomUUID();
    const lastName = 'admin';
    const name = 'transcendance';
    const pseudo = 'ico';
    const profile_photo_id;
    const birthdate = new Date('01-01-2001');
    const gamesPlayed = 999;
    const gamesWon = 999;
    const gamesLost = 999;
    const personalBest = 999;
    const pwd = 
    const [results] = await database.promise().query(
        'SELECT account_id FROM account WHERE email = ?', [emailAdmin]
    );
    if (results.length > 0)
        return ;
}

module.exports = initAdmin;