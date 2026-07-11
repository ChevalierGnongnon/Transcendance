const crypto = require('crypto');
const database = require('../../src/config/db-connexion.js');

const initDefaultProdilePictures = async() => {
    try{
        const [resCheckDefaultAvatar] = await database.promise().query(
            'SELECT COUNT(*) FROM account WHERE type=?', ['default_avatar']
        );
        if (resCheckDefaultAvatar[0]['COUNT(*)'] > 0)
            return ;
        const [adminId] = await database.promise().query(
            'SELECT account_id FROM account WHERE type=? AND email=?', ['admin', 'adm@transcendance.local']
        )
        const avatars = [
            { file_name: 'holocene.png', mime_type: 'image/png' },
            { file_name: 'hershel.webp', mime_type: 'image/webp' },
            { file_name: 'kindred.png', mime_type: 'image/png' },
            { file_name: 'radian.png', mime_type: 'image/png' },
            { file_name: 'taxman.png', mime_type: 'image/png' },
            { file_name: 'virtue.png', mime_type: 'image/png' },
        ];
        for (let i = 0; i < 6; i++){
            let id = crypto.randomUUID();
            const [insertFileId] = await database.promise().query(
                'INSERT INTO file(file_id, file_name, type, uploader_id, mime_type) VALUES(?, ?, ?, ?, ?)' ,
                [id, avatars[i].file_name, 'default_avatar', adminId[0].account_id, avatars[i].mime_type]
            )
        }
    } catch (err){
        console.error('init default avatars failed:', err);
    }

}

module.exports = initDefaultProdilePictures;


