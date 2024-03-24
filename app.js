const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const players = require('./routes/api/players');
const teams = require('./routes/api/teams');
const seasons = require('./routes/api/seasons');
const schedule = require('./routes/api/schedule');
const standings = require('./routes/api/standings');

const app = express();
const currentYear = new Date().getFullYear();

connectDB();

app.get('/api', (req, res) => res.send(
  `Hood Park Hockey League Official Website
  &copy; ${currentYear}`
));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use('/api/players', players);
app.use('/api/seasons', seasons);
app.use('/api/schedule', schedule);
app.use('/api/teams', teams);
app.use('/api/standings', standings);
