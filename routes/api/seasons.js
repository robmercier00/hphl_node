const express = require('express');
const router = express.Router();

const Seasons = require('../../models/Seasons');

// @route GET seasons
// @description Get all seasons
// @access Public
router.get('/', (req, res) => {
  Seasons.find()
    .then(seasons => res.json(seasons))
    .catch(err => res.status(404).json({ noSeasonsfound: 'No Seasons found' }));
});

// @route GET seasons/:id
// @description Get single season by id
// @access Public
router.get('/:id', (req, res) => {
  const seasonId = `UUID('${req.params.id}')`;
  console.log(seasonId);
  Seasons.find(req.params.id)
    .then(season => res.json(season))
    .catch(err => res.status(404).json({ noSeasonFound: 'No Season found' }));
});

module.exports = router;