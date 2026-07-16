const express = require('express');
const cookieParser = require('cookie-parser');
import database from './src/config/db-connexion';
const registrationRouter = require('./src/routes/auth/registration');
const app = express();
const port = 3000;
const completeProfileRouter = require('./src/routes/user/complete-profile');
const myProfileRouter = require('./src/routes/user/my-profile');
const loginRouter = require('./src/routes/auth/login');
const checkAuth = require('./src/routes/auth/check-auth');
const logoutRouter = require('./src/routes/auth/logout')
const helmet = require('helmet');
const cors = require('cors');
import { Request, Response  } from 'express'
// const updateProfile = require('./src/routes/user/update-profile');

const initAdmin = require('./database/scripts/init_admin');
const initDefaultPictures = require('./database/scripts/init_default_profile_pictures');

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