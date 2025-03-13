const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Players } = require('../../models/Players');
const { Seasons } = require('../../models/Seasons');
const { Teams } = require('../../models/Teams');

/**
 * @route GET players
 * @description Get all players
 * @access Public
 */
router.get('/', async (req, res) => {
  const isCurrentSeason = req.query.isCurrentSeason;
  const isGoalie = req.query.isGoalie;
  const allPlayers = req.query.allPlayers;
  const SeasonsModel = mongoose.model('season', Seasons);
  const TeamsModel = mongoose.model('team', Teams);
  const PlayersModel = mongoose.model('player', Players);

  let params = {};

  if (!allPlayers && isGoalie === 'false') {
    params = { isGoalie: isGoalie };
  }

  if (isCurrentSeason) {
    const seasonId = await SeasonsModel.findOne({ currentSeason: isCurrentSeason })
      .then(
        (season) => {
          return (season === null) ? null : season._id;
        }
      )
      .catch(err => res.status(404).json({
        noSeasonsFound: 'No Current Season Found'
      }));

    await TeamsModel.find({ season: seasonId })
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
                  player.goalsAgainst = player.goalsAgainst || (+player.shotsAgainst - +player.saves);
                  player.saves = player.saves || (+player.shotsAgainst - +player.goalsAgainst);
                  player.savePercentage = (+player.saves / +player.shotsAgainst).toFixed(3);
                }
              }
            }
          }

          res.json(seasonPlayers);
        }
      )
      .catch(err => res.status(404).json({ noSchedulesfound: 'No Teams found' }));
  } else {
    PlayersModel.find(params)
      .then(
        (players) => {
          for (let player of players) {
            if (isGoalie) {
              // Calculate advanced goalie stats
              if (typeof player.shotsAgainst !== 'undefined') {
                player.goalsAgainst = player.goalsAgainst || (+player.shotsAgainst - +player.saves);
                player.saves = player.saves || (+player.shotsAgainst - +player.goalsAgainst);
                player.savePercentage = (+player.saves / +player.shotsAgainst).toFixed(3);
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
  const PlayersModel = mongoose.model('player', Players);

  PlayersModel.find({ _id: new mongoose.Types.ObjectId(req.params.id)})
    .then(player => res.json(player))
    .catch(err => res.status(404).json({ noPlayerFound: 'No Player found' }));
});

/**
 * @route POST players
 * @description Create a new player
 * @access Public
 */
router.post('/', async (req, res) => {
  if (!req.body.playerName) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const name = req.body.playerName;
  const isGoalie = req.body.isGoalie || false;

  const PlayersModel = mongoose.model('player', Players);
    const player = new PlayersModel({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      isGoalie: isGoalie
    });
  
    await player.save(player)
      .then(player => res.status(200).json(player))
      .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }))
});

/**
 * @route PUT players
 * @description Update a player
 * @access Public
 */
router.put('/', async (req, res) => {
  if (!req.body.playerId || !req.body.playerName) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const playerId = mongoose.Types.ObjectId.createFromHexString(req.body.playerId);
  const name = req.body.playerName;
  const isGoalie = req.body.isGoalie

  const PlayersModel = mongoose.model('player', Players);

  await PlayersModel.replaceOne({ _id: playerId }, {
    name: name,
    isGoalie: isGoalie
  })
  .then(player => res.status(200).json(player))
  .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));
});
module.exports = router;