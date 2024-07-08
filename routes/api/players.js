const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const Players = require('../../models/Players');
const Seasons = require('../../models/Seasons');
const Teams = require('../../models/Teams');

/**
 * @route GET players
 * @description Get all players
 * @access Public
 */
router.get('/', async (req, res) => {
  const isCurrentSeason = req.query.isCurrentSeason;
  const isGoalie = req.query.isGoalie;
  let params = { isGoalie: isGoalie };

  if (isGoalie === 'false') {
    params = {}
  }

  if (isCurrentSeason) {
    const seasonId = await Seasons.findOne({ currentSeason: isCurrentSeason })
      .then(
        (season) => {
          return (season === null) ? null : season._id;
        }
      )
      .catch(err => res.status(404).json({
        noSeasonsFound: 'No Current Season Found'
      }));

    await Teams.find({ season: seasonId })
      .then(
        (teams) => {  
          const seasonPlayers = [];

          for (let team of teams) {
            for (let player of team.players) {
              if (((!player.isGoalie && isGoalie === 'false') ||
                (player.isGoalie && isGoalie !== 'false')) &&
                (!player.isSub || !player.isSub === 'true')) {
                seasonPlayers.push(player);
              }

              if (player.isGoalie) {
                // Calculate advanced goalie stats
                if (typeof player.shotsAgainst !== 'undefined') {
                  player.goalsAgainst = (+player.shotsAgainst - +player.saves);
                  player.savePercentage = (((+player.shotsAgainst) / (+player.goalsAgainst)) / 10).toFixed(3);
                }
              }
            }
          }

          res.json(seasonPlayers);
        }
      )
      .catch(err => res.status(404).json({ noSchedulesfound: 'No Teams found' }));
  } else {
    Players.find(params)
      .then(
        (players) => {
          for (let player of players) {
            if (isGoalie) {
              // Calculate advanced goalie stats
              if (typeof player.shotsAgainst !== 'undefined') {
                player.goalsAgainst = (+player.shotsAgainst - +player.saves);
                player.savePercentage = (((+player.shotsAgainst) / (+player.goalsAgainst)) / 10).toFixed(3);
              }
            }
          }

          res.json(players)
        }
      )
      .catch(err => res.status(404).json({ noPlayersfound: 'No Players found' }));
  }
});

/**
 * @route GET players/:id
 * @description Get single player by id
 * @access Public
 */
router.get('/:id', (req, res) => {
  const playerId = `UUID('${req.params.id}')`;
  console.log(playerId);
  Players.find(req.params.id)
    .then(player => res.json(player))
    .catch(err => res.status(404).json({ noPlayerFound: 'No Player found' }));
});

module.exports = router;