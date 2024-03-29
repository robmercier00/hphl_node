const express = require('express');
const router = express.Router();

const Announcements = require('../../models/Announcements');

/** 
 * @route GET announcements
 * @description Get all announcements
 * @access Public
 */

router.get('/', (req, res) => {
  const mostRecent = req.query.mostRecent;

  const limits = (mostRecent) ? 1 : 0;

  Announcements.find({}).sort({date: -1}).limit(limits)
    .then(announcements => res.status(200).json(announcements))
    .catch(err => res.status(404).json({ noAnnouncementsfound: 'No Announcements found' }));
});

module.exports = router;