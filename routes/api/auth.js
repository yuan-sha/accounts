var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

const {secret} = require('../../config/config')

const UserModel = require('../../models/UserModel');

const md5 = require('md5');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const data = await UserModel.findOne({
      username: username,
      password: md5(password)
    }).exec();

    if (!data) {
      return res.json({
        code: '2002',
        msg: 'Incorrect username or password~~~',
        data: null
      });
    }

    const token = jwt.sign(
        {
          username: data.username,
          _id: data._id
        },
        secret,
        { expiresIn: '7d' }
    );

    res.json({
      code: '0000',
      msg: 'Login successful',
      data: token
    });

  } catch (error) {
    res.json({
      code: '2001',
      msg: 'Database read error~~~',
      data: null,
      error: error.message
    });
  }
});


router.post('/logout', async (req, res) => {
  try {
    await new Promise((resolve) => req.session.destroy(resolve));

    res.render('success', { msg: 'Logout successful', url: '/login' });

  } catch (error) {
    res.json({
      code: '5000',
      msg: 'Logout failed~~',
      data: null,
      error: error.message
    });
  }
});


module.exports = router;