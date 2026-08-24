import { body } from 'express-validator';

export const loginValidator = [
  body('login')
    .trim()
    .notEmpty()
    .withMessage('Login is required')
    .isLength({ max: 255 })
    .withMessage('Login is too logn'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 255 })
    .withMessage('Password is too long'),
];

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name is too logn'),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name is too long'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 255 })
    .withMessage('Email is too long')
    .isEmail()
    .withMessage('Email is incorrect'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 255 })
    .withMessage('Password is too long')
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{12,}$/)
    .withMessage(
      'Password must be at least 12 characters long and contain at least one uppercase letter, one number, and one special character'
    ),
  body('passwordVerify')
    .isLength({ max: 255 })
    .withMessage('Password is too long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  body('birthdate')
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
        throw new Error('You must be at least 18 years old');
      }
      return true;
    }),
];

export const completeProfileValidator = [
  body('pseudo')
    .trim()
    .notEmpty()
    .withMessage('Pseudo is required')
    .matches(/^[a-zA-Z0-9_-]{3,30}$/)
    .withMessage('Invalid pseudo format'),
];
