var express = require('express');

var router = express.Router();

const UserModel = require('../../models/UserModel');

const md5 = require('md5');
const fs = require("fs");

router.get('/reg', (req, res) => {
  res.render('auth/reg');
});

router.post('/reg', async (req, res) => {
  try {
    const userData = {
      ...req.body,
      password: md5(req.body.password)
    };

    await UserModel.create(userData);

    res.render('success', { msg: 'Registration successful', url: '/login' });

  } catch (error) {
    res.status(500).send('Registration failed. Please try again later~~');
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const data = await UserModel.findOne({
      username: username,
      password: md5(password)
    }).exec();

    if (!data) {
      res.render('warning', {msg: 'Incorrect account or password~~', url: '/login'});
    }

    req.session.username = data.username;
    req.session._id = data._id;

    const timestamp = new Date().toISOString();
    const logMessage = `\r\n[${timestamp}] ${username} login in`;

    // Append the log with timestamp
    fs.appendFile('./log.txt', logMessage, err => {
      if (err) {
        console.log(err);
      }
    });

    res.render('success', { msg: 'Login successful', url: '/account' });

  } catch (error) {
    res.render('warning', {msg: 'Login failed. Please try again later~~', url: '/login'});
  }
});


router.post('/logout', (req, res) => {
  //销毁 session
  req.session.destroy(() => {
    res.render('success', {msg: 'Logout successful', url: '/login'});
  })
});

module.exports = router;