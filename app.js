const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const players = require('./routes/api/players');
const teams = require('./routes/api/teams');
const seasons = require('./routes/api/seasons');
const schedule = require('./routes/api/schedule');
const standings = require('./routes/api/standings');
const announcements = require('./routes/api/announcements');

const app = express();

connectDB();

app.get('/api', (req, res) => res.send(
  "Outdoor co-ed, all-ages roller hockey league in Derry, NH. Hood Park Hockey League. Hockey is for everyone."
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
app.use('/api/announcements', announcements);
