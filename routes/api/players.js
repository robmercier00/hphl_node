const express = require('express');
const router = express.Router();

const Players = require('../../models/Players');

// @route GET players
// @description Get all players
// @access Public
router.get('/', (req, res) => {
  const isGoalie = req.query.isGoalie;
  let params = { isGoalie: isGoalie };

  if (isGoalie === 'false') {
    params = {}
  }

  Players.find(params)
    .then(
      (players) => {
        for (let player of players) {
          if (isGoalie) {
            // Calculate advanced goalie stats
            if (typeof player.shotsAgainst !== 'undefined') {
              player.goalsAgainst = (+player.shotsAgainst - +player.saves);
              player.savePercentage = ((+player.goalsAgainst) / (+player.shotsAgainst)).toFixed(2);
            }
          }
        }

        res.json(players)
      }
    )
    .catch(err => res.status(404).json({ noPlayersfound: 'No Players found' }));
});

// @route GET players/:id
// @description Get single player by id
// @access Public
router.get('/:id', (req, res) => {
  const playerId = `UUID('${req.params.id}')`;
  console.log(playerId);
  Players.find(req.params.id)
    .then(player => res.json(player))
    .catch(err => res.status(404).json({ noPlayerFound: 'No Player found' }));
});

module.exports = router;