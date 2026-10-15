import { body, param } from 'express-validator';

export const userIdParamValidator = [
  param('userId')
    .notEmpty()
    .withMessage('USERID_REQUIRED')
    .isUUID()
    .withMessage('USERID_MUST_BE_VALID_UUID'),
];

export const idParamValidator = [
  param('id').notEmpty().withMessage('ID_REQUIRED').isUUID().withMessage('ID_MUST_BE_A_VALID_UUID'),
];

export const friendshipIdParamValidator = [
  param('friendshipId')
    .notEmpty()
    .withMessage('FRIENDSHIPID_REQUIRED')
    .isUUID()
    .withMessage('FRIENDSHIPID_MUST_BE_A_VALID_UUID'),
];
