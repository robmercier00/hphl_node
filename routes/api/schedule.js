const express = require('express');
const router = express.Router();
const Schedules = require('../../models/Schedules');
const Seasons = require('../../models/Seasons');
const Teams = require('../../models/Teams');

// @route GET schedule
// @description Get all schedule
// @access Public
router.get('/', async (req, res) => {
  const currentSeason = req.query.currentSeason;
  let seasonId = null;

  if (currentSeason) {
    seasonId = await Seasons.findOne({currentSeason: true})
      .then(
        (season) => {
          return season._id;
        }
      )
      .catch(err => res.status(404).json({ noSeasonsFound: 'No Seasons found' }));
  }

  Schedules.find({ season: seasonId })
    .then(
      async (schedules) => {
        for (let i = 0; i < schedules.length; i++) {
          const homeTeam = await Teams.find({ _id: schedules[i].homeTeam[0] })
            .select("name");
          const awayTeam = await Teams.find({ _id: schedules[i].awayTeam[0] })
            .select("name");

          schedules[i] = {
            ...schedules[i].toObject(),
            homeTeam: homeTeam[0].name,
            awayTeam: awayTeam[0].name
          };
        }

        const groupBy = function(sourceArray, key) {
          return sourceArray.reduce(function(reducedValues, singleSource) {
            (reducedValues[singleSource[key]] =
              reducedValues[singleSource[key]] || [])
            .push(singleSource);

            return reducedValues;
          }, {});
        };
        
        const formattedSchedule = groupBy(schedules, 'date');
        res.json(formattedSchedule);
      }
    )
    .catch(err => res.status(404).json({ noSchedulesfound: 'No Schedules found' }));
});

// @route GET seasons/:id
// @description Get single season by id
// @access Public
router.get('/:id', (req, res) => {
  const seasonId = `UUID('${req.params.id}')`;
  console.log(seasonId);
  Schedules.find(req.params.id)
    .then(season => res.json(season))
    .catch(err => res.status(404).json({ noScheduleFound: 'No Schedule found' }));
});

module.exports = router;