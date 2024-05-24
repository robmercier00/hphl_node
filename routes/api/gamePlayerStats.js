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
  

  res.json(["one", "two"]);
});

module.exports = router;