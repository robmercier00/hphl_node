const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const players = require('./routes/api/players');
const teams = require('./routes/api/teams');
const seasons = require('./routes/api/seasons');
const schedule = require('./routes/api/schedule');

const app = express();
const currentYear = new Date().getFullYear();

connectDB();

app.get('/', (req, res) => res.send(
  `Hood Park Hockey League Official Website
  &copy; ${currentYear}`
));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use('/players', players);
app.use('/seasons', seasons);
app.use('/schedule', schedule);
app.use('/teams', teams);
