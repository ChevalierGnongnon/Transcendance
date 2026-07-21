import express, {Request, Response} from 'express'
import database from '../../config/db-connexion';
import { RowDataPacket } from 'mysql2'
const router = express.Router();

router.get('/default-avatars', async(req: Request, res: Response) =>{
    
    try{
        const [query] = await database.promise().query<RowDataPacket[]>(
            'SELECT file_id, file_name FROM file WHERE type = ?', ['default_avatar']
        )
        return (res.json(query));
    } catch (err) {
        return (res.status(500)).json({error: 'DATABASE_ERROR'});
    }
})
export = router;