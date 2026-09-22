import type { Request, Response } from 'express';
import UsersService from './users.services.ts';
import { NotFoundError } from '../../common/errors.js';
import usersServices from './users.services.ts';

export async function getMyProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const user = await UsersService.getUserById(userId);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
}



export async function updateProfilePhoto(req: Request, res: Response) {
  const userId = req.userId!;
  const avatarId = req.body.avatar;

  try {
    await UsersService.updateProfilePhoto(userId, avatarId);
    return (res.status(200).json({success:true}))
  }
  catch (error) {
    if (error instanceof Error && error.message === 'INVALID_AVATAR'){
      return res.status(400).json({ error: 'INVALID_AVATAR' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

export async function searchUsers(req: Request, res: Response){
  try{
    const input = req.query.q?.toString();
    const userId = req.userId!;

    const users = await usersServices.searchUsers(input!, userId);
    return (res.status(200).json(users));
  } catch(error) {
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
  
}

export async  function getUserByPseudo(req: Request, res: Response) {
  try{
    const pseudo = req.params.pseudo;
    if (typeof pseudo !== 'string')
      return (res.status(400).json({error: 'INVALID_PSEUDO'}))
    const infos = await usersServices.getUserInfo(pseudo);
    return (res.status(200).json(infos))
  }catch (error){
    if (error instanceof NotFoundError)
      return (res.status(404).json({ error: 'USER_NOT_FOUND' }));
    return (res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' }));

  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await UsersService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = await UsersService.getUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function updateUser(req: Request, res: Response){
  try {
    const { first_name, last_name, pseudo } = req.body;
    const userId = req.userId!;

    if (last_name !== undefined){
      await  UsersService.updateLastName(userId, last_name);
    }

    if (first_name !== undefined){
      await  UsersService.updateFirstName(userId, first_name);
    }

    if (pseudo !== undefined){
      await  UsersService.updatePseudo(userId, pseudo);
    }
    return (res.status(200).json({success:true}))
  } catch (error) {
    if (error instanceof Error && error.message === 'PSEUDO_EXISTS') {
      return res.status(409).json({ error: 'PSEUDO_EXISTS' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}