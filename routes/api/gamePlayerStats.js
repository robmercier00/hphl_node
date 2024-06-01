const express = require('express');
const router = express.Router();
const Schedules = require('../../models/Schedules');
const Seasons = require('../../models/Seasons');
const Teams = require('../../models/Teams');

/**
 * @route GET gamePlayerStats
 * @description Get the player stats for a particular game
 * @access Public
 */
router.get("/", async (req, res) => {
  const gameId = req.query.gameId;

  Schedules.find({ _id: gameId })
    .then( (gameStats) => {
      gameStats[0].homeTeamPlayers.forEach( player => {
        if (player.isGoalie) {
          player.goalsAgainst = gameStats[0].awayTeamScore;
        }
      });

      gameStats[0].awayTeamPlayers.forEach( player => {
        if (player.isGoalie) {
          player.goalsAgainst = gameStats[0].homeTeamScore;
        }
      });

      res.status(200).json(gameStats[0])
    })
    .catch(err => res.status(404).json({ noSchedulesfound: 'No Schedules found' }));
});

module.exports = router;