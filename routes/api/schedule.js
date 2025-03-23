const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schedules = require('../../models/Schedules');
const Seasons = require('../../models/Seasons');
const Teams = require('../../models/Teams');

/**
 * @route GET schedule
 * @description Get all schedule
 * @access Public
 */
router.get('/', async (req, res) => {
  const currentSeason = req.query.currentSeason;
  const nextWeek = req.query.nextWeek;
  let seasonId = null;

  if (currentSeason) {
    seasonId = await Seasons.findOne({currentSeason: currentSeason})
      .then(
        (season) => {
          return (season === null) ? null : season._id;
        }
      )
      .catch(err => res.status(404).json({
        noSeasonsFound: 'No Current Season Found'
      }));
  }

  const limits = (nextWeek) ? 6 : 0;
  const oneWeek = (nextWeek) ? new Date().toLocaleDateString() : "2000-01-01";

  Schedules.find({
    season: seasonId,
    date: {$gte: oneWeek }
  }).sort({date: 1, time: 1}).limit(limits)
    .then(
      async (schedules) => {
        for (let i = 0; i < schedules.length; i++) {
          const homeTeam = await Teams.find({ _id: schedules[i].homeTeam[0] })
            .select("name");
          const awayTeam = await Teams.find({ _id: schedules[i].awayTeam[0] })
            .select("name");

          schedules[i] = {
            ...schedules[i].toObject(),
            homeTeamName: homeTeam[0].name,
            awayTeamName: awayTeam[0].name
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
        res.status(200).json(formattedSchedule);
      }
    )
    .catch(err => res.status(404).json({ noSchedulesfound: 'No Schedules found' }));
});

/**
 * @route GET seasons/:id
 * @description Get single season by id
 * @access Public
 */
router.get('/:id', (req, res) => {
  const seasonId = `UUID('${req.params.id}')`;
  console.log(seasonId);
  Schedules.find(req.params.id)
    .then(season => res.status(200).json(season))
    .catch(err => res.status(404).json({ noScheduleFound: 'No Schedule found' }));
});

/**
 * @route PUT scheduled game metadata
 * @description PUT metadata related to a specific scheduled game
 * @access Public
 */
router.put('/', async (req, res) => {
  const game = req.query.game;
  const gameId = mongoose.Types.ObjectId.createFromHexString(game._id);
  delete(game._id);
  game.season = mongoose.Types.ObjectId.createFromHexString(game.season);
  game.homeTeam = mongoose.Types.ObjectId.createFromHexString(game.homeTeam);
  game.awayTeam = mongoose.Types.ObjectId.createFromHexString(game.awayTeam);
  console.log("gameId");
  console.log(gameId);
  console.log("game");
  console.log(game);
  const gameRecord = await Schedules.findOneAndUpdate(
    {_id: gameId},
    {$set: game}
  )
  .then((game) => {
    res.status(200).json(game);
  })
  .catch(err => res.status(404).json({ scheduleNotUpdated: 'Schedule could not be updated' }));
});

module.exports = router;