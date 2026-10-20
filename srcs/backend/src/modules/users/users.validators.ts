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
        .isString()
        .withMessage('INVALID_FIRST_NAME')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('FIRST_NAME_REQUIRED')
        .isLength({ max: 50 })
        .withMessage('FIRST_NAME_TOO_LONG'),
    body('last_name')
        .optional()
        .isString()
        .withMessage('INVALID_LAST_NAME')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('LAST_NAME_REQUIRED')
        .isLength({ max: 50 })
        .withMessage('LAST_NAME_TOO_LONG'),
    body('pseudo')
        .optional()
        .isString()
        .withMessage('PSEUDO_INVALID')
        .bail()
        .matches(/^[a-zA-Z0-9_-]{3,30}$/)
        .withMessage('PSEUDO_INVALID'),

]

export const avatarUpdateValidator=[
    body('avatar')
        .isString()
        .withMessage('INVALID_AVATAR')
        .isUUID()
        .withMessage('INVALID_AVATAR')
        
]