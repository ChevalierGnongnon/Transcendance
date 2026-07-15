const express = require('express');
const cookieParser = require('cookie-parser');
const database = require('./src/config/db-connexion.js');
const registrationRouter = require('./src/routes/auth/registration.js');
const app = express();
const port = 3000;
const completeProfileRouter = require('./src/routes/user/complete-profile.js');
const myProfileRouter = require('./src/routes/user/my-profile.js');
const loginRouter = require('./src/routes/auth/login.js');
const checkAuth = require('./src/routes/auth/check-auth.js');
const logoutRouter = require('./src/routes/auth/logout.js')
const helmet = require('helmet');
const cors = require('cors');
// const updateProfile = require('./src/routes/user/update-profile.js');

const initAdmin = require('./database/scripts/init_admin.js');
const initDefaultPictures = require('./database/scripts/init_default_profile_pictures.js');

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

app.get('/health', (req, res) => {
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