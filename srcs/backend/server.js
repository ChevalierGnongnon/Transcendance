const express = require('express');
const cookieParser = require('cookie-parser');
const database = require('./src/db-connexion.js');
const registrationRouter = require('./src/registration.js');
const app = express();
const port = 3000;
const completeProfileRouter = require('./src/complete-profile.js');
const myProfileRouter = require('./src/my-profile.js');
const loginRouter = require('./src/login.js');
const checkAuth = require('./src/check-auth.js');
const logout = require('./src/logout.js')

app.use(express.json());
app.use(cookieParser());
app.use('/api', registrationRouter);
app.use('/api', completeProfileRouter);
app.use('/api', myProfileRouter);
app.use('/api', loginRouter);
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