const express = require('express');

const moment = require('moment');

const AccountModel = require('../../models/AccountModel');

const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/account');
})

router.get('/account', checkLoginMiddleware, async function(req, res, next) {
  try {
    const data = await AccountModel.find().sort({ time: -1 }).exec();
    res.render('list', { accounts: data, moment: moment });
  } catch (err) {
    res.status(500).send('Read failed~~~');
  }
});

router.get('/account/create',checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

router.post('/account', checkLoginMiddleware, async (req, res) => {
  try {
    const data = await AccountModel.create({
      ...req.body,
      time: moment(req.body.time).toDate(),
    });

    res.render('success', { msg: 'Added successfully~~~', url: '/account' });
  } catch (err) {
    res.status(500).send('Failed to insert.~~');
  }
});


router.get('/account/:id', checkLoginMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    await AccountModel.deleteOne({ _id: id });

    res.render('success', { msg: 'Deleted successfully~~~', url: '/account' });
  } catch (err) {
    res.status(500).send('Deletion failed~');
  }
});


module.exports = router;
