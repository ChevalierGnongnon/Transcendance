const express = require('express');
const database = require('./src/db-connexion.js');
const app = express();
const port = 3000;

const registrationRouter = require('./registration.js');

app.use('/api', registrationRouter);
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK')
});

app.listen(port, () => {
    console.log("express ready");
});

database.query('SELECT 1', (err, results) => {
  if (err) {
      console.error('DB connection failed:', err);
  } else {
      console.log('DB connected!');
  }
});

