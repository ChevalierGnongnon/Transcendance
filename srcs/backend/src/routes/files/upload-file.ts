import express from 'express';
import multer from 'multer';
import jwt  from 'jsonwebtoken';
import database from '../../config/db-connexion';
import uploadConfig from '../../config/multer-config';
import checkAuthToken from '../../middlewares/check-auth-token';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
const router = express.Router();
import { Request, Response } from 'express';

const upload = uploadConfig({
    maxSize: 5 * 1024 * 1024, 
    fileFilter: (req, file, cb) => {
        const allowed  = ['image/png', 'image/webp', 'image/jpeg'];
        cb(null, allowed.includes(file.mimetype));
    }
})

router.post('/upload', checkAuthToken, upload.single('file'), async(req: Request, res: Response) =>{
    try {
        if (!req.file)
            return (res.status(400).json({error: 'NO_FILE_UPLOADED'}));
        if (!req.account || typeof req.account === 'string')
            return (res.status(401).json({error:'INVALID_TOKEN'}));
        const { fileTypeFromBuffer } = await import('file-type');
        const type = await fileTypeFromBuffer(req.file.buffer);
        if (!type || !['png', 'webp', 'jpg'].includes(type.ext))
            return (res.status(400).json({error: 'WRONG_FILE_TYPE'}));
        const result = await sharp(req.file.buffer).toFormat('webp').toBuffer();
        const id = randomUUID();
        const fileName = `${id}.webp`;
        fs.writeFileSync(`/app/uploads/${fileName}`, result);
        const [results] = await database.promise().query(
            'INSERT INTO file (file_id, file_name, type, uploader_id, mime_type) VALUES (?, ?, ?, ?, ?)',
            [id, fileName, 'profile_photo', req.account.account_id, 'image/webp']
        );
        const [updateWithProfilePhoto] = await database.promise().query(
            'UPDATE account SET profile_photo_id = ? WHERE account_id = ?',
            [id, req.account.account_id]
        );
        return res.status(201).json({ file_id: id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'UPLOAD_FAILED' });
    }
})
export = router;