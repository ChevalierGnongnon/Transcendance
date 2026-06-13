const express = require('express');
const database = require('./src/db-connexion.js');
const registrationRouter = require('./src/registration.js');
const app = express();
const port = 3000;
const completeProfileRouter = require('./src/complete-profile.js');
const myProfileRouter = require('./src/my-profile.js');
const loginRouter = require('./src/login.js');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use('/api', registrationRouter);
app.use('/api', completeProfileRouter);
app.use('/api', myProfileRouter);
app.use('/api', loginRouter);

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