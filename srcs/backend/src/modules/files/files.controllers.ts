import type { Request, Response } from 'express';

import FileService from './files.services.js';
import { NotFoundError } from '../../common/errors.js';
import { UnsupportedFileTypeError } from '../../common/errors.js';
import { ForbiddenRightsError } from '../../common/errors.js';

export async function getDefaultAvatars(req: Request, res: Response) {
  try {
    const avatars = await FileService.getDefaultAvatars();

    return res.status(200).json(avatars);
  } catch (error) {
    console.error('Get default avatars error:', error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'Default avatars not found' });
    }
  }
  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
  });
}

export async function uploadAvatar(req: Request, res: Response){
  try{
    if (!req.file)
      return (res.status(400).json({error: 'NO_FILE_PROVIDED'}));
    if (!req.userId)
      return (res.status(401).json({error: 'USER_NOT_FOUND'}));
    const id = await FileService.createFile(req.file.buffer, req.userId, 'profile_photo');
    return (res.status(201).json({ file_id: id }));

  }catch(error){
    console.error('Upload avatar error:', error);

    if (error instanceof UnsupportedFileTypeError) {
      return res.status(415).json({ error: 'WRONG_FILE_TYPE' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

export async function deleteFile(req: Request, res: Response){
  try{
    if (!req.userId)
      return (res.status(401).json({error: 'USER_NOT_FOUND'}));
    if (typeof req.params.id !== 'string')
      return res.status(400).json({ error: 'INVALID_FILE_ID' });
    await FileService.deleteFile(req.params.id, req.userId);
    return res.status(204).send();
  } catch (error){
    console.error('Delete file error:', error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'FILE_NOT_FOUND' });
    }
    if (error instanceof ForbiddenRightsError) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}



