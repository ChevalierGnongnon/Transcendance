import { query, body } from 'express-validator';


export const searchValidator=[
    query('q')
        .trim()
        .notEmpty()
        .withMessage('QUERY_REQUIRED')
        .isLength( {max: 50} )
        .withMessage('ENTRY_TOO_LONG')
]

export const updateValidator=[
    body('first_name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('FIRST_NAME_TOO_LONG'),
    body('last_name')
        .optional()
        .isLength({ max: 50 })
        .withMessage('LAST_NAME_TOO_LONG'),
    body('pseudo')
        .optional()
        .matches(/^[a-zA-Z0-9_-]{3,30}$/)
        .withMessage('PSEUDO_INVALID'),
]