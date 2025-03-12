const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Seasons } = require('../../models/Seasons');

/**
 * @route GET seasons
 * @description Get all seasons
 * @access Public
 */
router.get('/', (req, res) => {
  const SeasonsModel = mongoose.model('season', Seasons);
  SeasonsModel.find({}).sort( { "end_date": -1 } )
    .then(seasons => res.status(200).json(seasons))
    .catch(err => res.status(404).json({ noSeasonsfound: 'No Seasons found' }));
});

/**
 * @route GET seasons/:id
 * @description Get single season by id
 * @access Public
 */
router.get('/:id', (req, res) => {
  const SeasonsModel = mongoose.model('season', Seasons);
  SeasonsModel.find({_id: new mongoose.Types.ObjectId(req.params.id)})
    .then(season => res.status(200).json(season))
    .catch(err => res.status(404).json({ noSeasonFound: 'No Season found' }));
});

/**
 * @route POST seasons
 * @description Create a new season
 * @access Public
 */
router.post('/', async (req, res) => {
  if (!req.body.seasonName || !req.body.seasonStartDate || !req.body.seasonEndDate) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const name = req.body.seasonName;
  const start_date = req.body.seasonStartDate;
  const end_date = req.body.seasonEndDate;
  const currentSeason = req.body.isCurrentSeason

  const SeasonsModel = mongoose.model('season', Seasons);
  const season = new SeasonsModel({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    start_date: start_date,
    end_date: end_date,
    currentSeason: currentSeason
  });

  await season.save(season)
    .then(season => res.status(200).json(season))
    .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));
});

/**
 * @route PUT seasons
 * @description Update a season
 * @access Public
 */
router.put('/', async (req, res) => {
  if (!req.body.seasonId || !req.body.seasonName || !req.body.seasonStartDate || !req.body.seasonEndDate) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const seasonId = mongoose.Types.ObjectId.createFromHexString(req.body.seasonId);
  const name = req.body.seasonName;
  const start_date = req.body.seasonStartDate;
  const end_date = req.body.seasonEndDate;
  const currentSeason = req.body.isCurrentSeason

  const SeasonsModel = mongoose.model('season', Seasons);

  await SeasonsModel.replaceOne({ _id: seasonId }, {
    name: name,
    start_date: start_date,
    end_date: end_date,
    currentSeason: currentSeason
  })
  .then(season => res.status(200).json(season))
  .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));
});

module.exports = router;