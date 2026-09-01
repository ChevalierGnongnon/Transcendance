import { body, param } from 'express-validator';

export const validateUuid = [
  param('chatId').isUUID().withMessage('Invalid chat ID format. Must be a valid UUID.'),
];

/// Expamles
export const loginValidator = [
  body('login')
    .trim()
    .notEmpty()
    .withMessage('LOGIN_REQUIRED')
    .isLength({ max: 255 })
    .withMessage('LOGIN_TOO_LONG'),
  body('password')
    .notEmpty()
    .withMessage('PASSWORD_REQUIRED')
    .isLength({ max: 255 })
    .withMessage('PASSWORD_TOO_LONG'),
];

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('FIRST_NAME_REQUIRED')
    .isLength({ max: 50 })
    .withMessage('FIRST_NAME_TOO_LONG'),
  body('last_name')
    .notEmpty()
    .withMessage('LAST_NAME_REQUIRED')
    .isLength({ max: 50 })
    .withMessage('LAST_NAME_REQUIRED'),
  body('email')
    .notEmpty()
    .withMessage('EMAIL_REQUIRED')
    .isLength({ max: 255 })
    .withMessage('EMAIL_TOO_LONG')
    .isEmail()
    .withMessage('EMAIL_INVALID'),
  body('password')
    .notEmpty()
    .withMessage('PASSWORD_WEAK')
    .isLength({ max: 255 })
    .withMessage('')
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{12,}$/)
    .withMessage('PASSWORD_WEAK'),
  body('passwordVerify').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('PASSWORDS_DO_NOT_MATCH');
    }
    return true;
  }),
  body('birthdate')
    .notEmpty()
    .withMessage('AGE_REQUIREMENT')
    // .isISO8601()
    // .withMessage('Email is required')
    .toDate()
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error('');
      }
      return true;
    }),
];
