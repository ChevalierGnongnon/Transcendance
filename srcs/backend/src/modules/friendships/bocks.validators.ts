import { body, param } from 'express-validator';


export const userIdParamValidator = [param('userId').notEmpty().withMessage('USERID_REQUIRED').isUUID().withMessage('USERID_MUST_BE_VALID_UUID')];
