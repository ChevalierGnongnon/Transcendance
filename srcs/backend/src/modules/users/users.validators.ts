import { query } from 'express-validator';

export const searchValidator=[
    query('q')
        .trim()
        .notEmpty()
        .withMessage('QUERY_REQUIRED')
        .isLength( {max: 50} )
        .withMessage('ENTRY_TOO_LONG')
]