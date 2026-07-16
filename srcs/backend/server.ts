import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import database from './src/config/db-connexion';
import registrationRouter from './src/routes/auth/registration';
import completeProfileRouter from './src/routes/user/complete-profile';
import myProfileRouter from './src/routes/user/my-profile';
import loginRouter from './src/routes/auth/login';
import checkAuth from './src/routes/auth/check-auth';
import logoutRouter from './src/routes/auth/logout';
import helmet from 'helmet';
import cors from 'cors';
import initAdmin from './database/scripts/init_admin';
import initDefaultPictures from './database/scripts/init_default_profile_pictures';
// import updateProfile from './src/routes/user/update-profile';

const app = express();
const port = 3000;

const start = async () => {
    await initAdmin();
    await initDefaultPictures();
};
start();

//packages 
app.use(helmet());
app.use(cors({ origin: 'https://transcendance.fr' }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api', registrationRouter);
app.use('/api', completeProfileRouter);
app.use('/api', myProfileRouter);
app.use('/api', loginRouter);
app.use('/api', logoutRouter);
// app.use('/api', updateProfile);
app.use('/api', checkAuth);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK')
});

app.listen(port, () => {
    console.log("express ready");
});

database.query('SELECT 1', (err, results) => {
    if (err)
        console.error('DB connection failed:', err);
    else
        console.log('DB connected!');
});