const express = require('express');
const router = express.Router();

const Teams = require('../../models/Teams');
const Players = require('../../models/Players');
const Seasons = require('../../models/Seasons');

/**
 * @route GET teams
 * @description Get teams and their players
 * @access Public
 */
router.get('/', async (req, res) => {
  const currentSeason = req.query.currentSeason;
  let seasonId = null;

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

  Teams.find(params)
    .then(
      async (teams) => {
        for (let team of teams) {
          // Retrieve player names from their id
          for (let player of team.players) {
            const onePlayer = await Players.findOne({_id: player.id});

            if (onePlayer.name) {
              player.name = onePlayer.name;
            }

            if (!player.assists) {
              player.assists = null;
            }

            if (!player.goals) {
              player.goals = null;
            }
          };
        };

        res.json(teams);
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
  const teamId = `UUID('${req.params.id}')`;
  console.log(teamId);
  Teams.find(req.params.id)
    .then(team => res.json(team))
    .catch(err => res.status(404).json({ noTeamFound: 'No Team found' }));
});

module.exports = router;
