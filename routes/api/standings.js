const express = require('express');
const router = express.Router();
const Seasons = require('../../models/Seasons');
const Teams = require('../../models/Teams');

/**
 * @route GET standings
 * @description Get all standings
 * @access Public
 */
router.get('/', async (req, res) => {
  const seasonId = await Seasons.findOne({currentSeason: true})
    .then(
      (season) => {
        return (season === null) ? null : season._id;
      }
    )
    .catch(err => res.status(404).json({
      noSeasonsFound: 'No Current Season Found'
    }));

  /**
   * Team standings are calculated as:
   *   2 pts for a win
   *   1 pt for a tie
   *   0 pts for a tie
   * Team with the most points is higher in standings
   * First tie breaker is goals for
   * Second tie breaker is goals against
   */
  Teams.find({ season: seasonId })
    .then(
      (standings) => {        
        for (let team of standings) {
          team.points = 0;
          team.points = +team.points + (+team.win * 2);
          team.points = +team.points + +team.tie;
        }

        standings.sort((a, b) => {
          if (a.points === b.points) {
            if (a.goalsFor === b.goalsFor) {
              return a.goalsAgainst < b.goalsAgainst ? 1 : -1;
            } else {
              return a.goalsFor < b.goalsFor ? 1 : -1;
            }
          } else {
            return a.points < b.points ? 1 : -1;
          }

        });

        res.json(standings);
      }
    )
    .catch(err => res.status(404).json({ noSchedulesfound: 'No Teams found' }));
});

module.exports = router;
