import { body, param } from 'express-validator';

export const friendshipValidator = [
  body('friendId')
    .isLength({ max: 255 })
    .isUUID()
    .withMessage('Invalid ID format. Must be a valid UUID.'),
];

export const updateFriendshipValidator = [
  param('id').isUUID().withMessage('id must be a valid UUID'),
  body('status')
    .exists({ checkFalsy: true })
    .withMessage('status is required')
    .isString()
    .withMessage('status must be a string')
    .isIn(['accepted', 'refused', 'cancelled', 'blocked'])
    .withMessage('status must be one of: accepted, refused, cancelled, blocked'),
];

export const idParamValidator = [param('id').isUUID().withMessage('id must be a valid UUID')];
