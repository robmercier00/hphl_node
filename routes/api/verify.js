const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Admins = require('../../models/Admins');

/**
 * @route POST verify
 * @description Verify an admin user
 * @access Public
 */
router.post('/', async (req, res) => {
  let tokenId = null;

  if (req.body.password) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const username = req.body.username;

  const admin = await Admins.findOne({ username: username })
      .then((admin) => {
        return admin 
      })
      .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));

  if (admin && !admin.password) {
    tokenId = 'reset-password';
  } else if (admin && admin.password) {
    tokenId = admin.token;
  }

  res.status(200).json({ token: tokenId });
});


/**
 * @route GET token
 * @description Validate existing token for user
 * @access Private
 */
router.get('/', async (req, res) => {
  const token = req.query.token;
  const curDate = new Date();
  const isValid = await Admins.findOne({ token: token })
    .then((admin) => {
      if (admin.token_expires < curDate) {
        return false;
      }

      return (admin) ? true : false;
    })
    .catch(err => res.status(404).json({ noAdminfound: 'Invalid token' }));

  res.status(200).json({ isValid: isValid});
});

module.exports = router;