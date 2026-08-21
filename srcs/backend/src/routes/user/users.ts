import express from 'express';
import database from '../../config/db-connexion';
import { RowDataPacket } from 'mysql2';
import checkAuthToken from '../../middlewares/check-auth-token';

const router = express.Router();

// GET /api/users
router.get('/api/users', checkAuthToken, async (req, res) => {
  try {
    const [rows] = await database.promise().query<RowDataPacket[]>(
      'SELECT account_id, pseudo FROM account WHERE is_deleted = false'
    );

    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'DATABASE_ERROR' });
  }
});

// GET /api/user/:id
router.get('/api/user/:id', checkAuthToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await database.promise().query<RowDataPacket[]>(
      'SELECT account_id, pseudo FROM account WHERE account_id = ? AND is_deleted = false',
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'DATABASE_ERROR' });
  }
});

export default router;
