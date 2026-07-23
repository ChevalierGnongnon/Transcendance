// import fs from 'fs';
// import express from 'express';
// import database from '../../config/db-connexion';
// const router = express.Router();
// import rateLimit from '../../middlewares/rate-limiter';
// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { RowDataPacket } from 'mysql2';

// const github_id = fs.readFileSync('/run/secrets/OAuth_client_github_id', 'utf8').trim();
// const github_secret = fs.readFileSync('/run/secrets/OAuth_client_github_secret', 'utf8').trim();

// router.get('/auth/github', rateLimit, (req:Request, res:Response) => {
//     const state = crypto.randomUUID();

//     res.cookie('github_oauth_state', state, {httpOnly: true, secure: true,  sameSite: 'lax', maxAge: 10 * 60 * 1000});
//     const params = new URLSearchParams({
//         client_id: github_id,
//         redirect_uri: 'https://localhost:8443/api/auth/github/callback', 
//         scope:'user:email',
//         state: state
//     });
//     const paramsStr = params.toString()
//     res.redirect(`https://github.com/login/oauth/authorize?${paramsStr}`);
// })

// router.get('/auth/github/callback', rateLimit, async(req: Request, res: Response) => {
//     const state = req.query.state;
//     const code = req.query.code;
//     const Oauth_state = req.cookies.github_oauth_state;

//     if (!state || !code || !Oauth_state)
//         return (res.status(403).json({errror: 'INVALID_OAUTH_TOKEN'}));
//     res.clearCookie('github_oauth_state'); 
// })
// export = router;