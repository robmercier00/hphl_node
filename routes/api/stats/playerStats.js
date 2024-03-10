const express = require('express');
const router = express.Router();

// const Teams = require('../../models/Teams');

// // @route GET teams
// // @description Get all teams
// // @access Public
// router.get('/', (req, res) => {
//   Teams.find()
//     .then(teams => res.json(teams))
//     .catch(err => res.status(404).json({ noTeamsfound: 'No Teams found' }));
// });

// // @route GET teams/:id
// // @description Get single team by id
// // @access Public
// router.get('/:id', (req, res) => {
//   const teamId = `UUID('${req.params.id}')`;
//   console.log(teamId);
//   Teams.find(req.params.id)
//     .then(team => res.json(team))
//     .catch(err => res.status(404).json({ noTeamFound: 'No Team found' }));
// });

// module.exports = router;