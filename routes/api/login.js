const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Admins = require('../../models/Admins');

/**
 * @route PUT login with new password
 * @description Login an admin user
 * @access Public
 */
router.put('/', async (req, res) => {
  let tokenId = null;

  if (!req.body.user || !req.body.password) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const username = req.body.user;
  const password = req.body.password;
  const token = crypto.randomBytes(Math.ceil(20 / 2)).toString('hex').slice(0, 20);
  const newData = {};
  newData.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  newData.token = token;
  newData.last_login = new Date();
  newData.token_expires = new Date();
  newData.token_expires.setDate(newData.token_expires.getDate() + 2);

  tokenId = await Admins.findOneAndUpdate(
    { username: username },
    newData,
    { upsert: true, new: true }
  )
  .then(() => {
    return token;
  })
  .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));

  res.status(200).json({ token: tokenId });
});

/**
 * @route POST login
 * @description Login an admin user
 * @access Public
 */
router.post('/', async (req, res) => {
  let tokenId = null;

  if (!req.body.username || !req.body.password) {
    res.status(400).json({ invalidRequest: 'Invalid request' });
  }

  const username = req.body.username;
  const password = req.body.password;

  const adminUser = await Admins.findOne(
    { username: username }
  )
  .then((admin) => {
    if (admin) {
      const isValid = bcrypt.compareSync(password, admin.password);

      if (isValid) {
        return admin;
      } else {
        res.status(404).json({ noAdminfound: 'No Admin found' });
      }
    }
  })
  .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));
  console.log("adminUser");

  if (adminUser) {
    const token = crypto.randomBytes(Math.ceil(20 / 2)).toString('hex').slice(0, 20);
    const newData = {};
    newData.token = adminUser.token ?? token;
    newData.last_login = new Date();
    newData.token_expires = new Date();
    newData.token_expires.setDate(newData.token_expires.getDate() + 2);
  
    tokenId = await Admins.findOneAndUpdate(
      { username: username },
      newData,
      { upsert: true, new: true }
    )
    .then((admin) => {
      return admin.token;
    })
    .catch(err => res.status(404).json({ noAdminfound: 'No Admin found' }));

  }

  res.status(200).json({ token: tokenId });
});

module.exports = router;