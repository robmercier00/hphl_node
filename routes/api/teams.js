const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Teams } = require('../../models/Teams');
const Players = require('../../models/Players');
const Seasons = require('../../models/Seasons');

/**
 * @route GET teams
 * @description Get teams and their players
 * @access Public
 */
router.get('/', async (req, res) => {
  const currentSeason = req.query.currentSeason ?? false;
  let seasonId = req.query.seasonId
    ? mongoose.Types.ObjectId.createFromHexString(req.query.seasonId)
    : null;

  if (currentSeason) {
    seasonId = await Seasons.findOne({currentSeason: 1})
      .then(
        (season) => {
          return (season === null) ? null : season._id;
        }
      )
      .catch(err => res.status(404).json({
        noSeasonsFound: 'No Current Season Found'
      }));
  }

  let params = {};

  if (seasonId !== null) {
    params = { season: seasonId }
  }

  const TeamsModel = mongoose.model('team', Teams);
  TeamsModel.find(params)
    .then(
      async (teams) => {
        for (let team of teams) {
          // Retrieve player names from their id
          for (let player of team.players) {
            const onePlayer = await Players.findOne({
              _id: player.id
            });

            if (onePlayer) {
              if (onePlayer.name) {
                player.name = onePlayer.name;
              }
  
              if (!player.assists) {
                player.assists = null;
              }
  
              if (!player.goals) {
                player.goals = null;
              }
            }
          };
        };

        res.status(200).json(teams);
      }
    )
    .catch(err => res.status(404).json({ noTeamsfound: 'No Teams found' }));
});

/**
 * @route GET teams/:id
 * @description Get single team by id
 * @access Public
 */
router.get('/:id', (req, res) => {
  const TeamsModel = mongoose.model('team', Teams);
  TeamsModel.find({_id: new mongoose.Types.ObjectId(req.params.id)})
    .then(team => res.json(team))
    .catch(err => res.status(404).json({ noTeamFound: 'No Team found' }));
});

/**
 * @route POST teams
 * @description Create a new team for a specific season
 * @access Public
 */
router.post('/', async (req, res) => {
  if (!req.body.teamName) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

    const name = req.body.teamName;
    const color = req.body.teamColor;
    const season = mongoose.Types.ObjectId.createFromHexString(req.body.season);
  
    const TeamsModel = mongoose.model('team', Teams);
    const team = new TeamsModel({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      color: color,
      season: season
    });
  
    await team.save(team)
      .then(team => res.status(200).json(team))
      .catch(err => res.status(404).json({ noTeamfound: 'No Team found' }));
});

/**
 * @route PUT teams
 * @description Update an existing team
 * @access Public
 */
router.put('/', async (req, res) => {
  if (!req.body.teamName || !req.body.teamId) {
    res.status(400).json({ invalidRequest: 'Invalid Request' });
  }

  const teamId = mongoose.Types.ObjectId.createFromHexString(req.body.teamId);
  const name = req.body.teamName;
  const color = req.body.teamColor;
  const season = mongoose.Types.ObjectId.createFromHexString(req.body.season);

  const TeamsModel = mongoose.model('team', Teams);
  
  await TeamsModel.replaceOne({ _id: teamId }, {
    name: name,
    color: color,
    season: season
  })
  .then(team => res.status(200).json(team))
  .catch(err => res.status(404).json({ noTeamfound: 'No Team found' }));
});

module.exports = router;
