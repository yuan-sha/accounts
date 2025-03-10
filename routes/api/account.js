const express = require('express');;

let checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

const router = express.Router();

const moment = require('moment');

const AccountModel = require('../../models/AccountModel');

router.get('/account', async (req, res) => {
  try {
    const data = await AccountModel.find().sort({ time: -1 }).exec();

    res.json({
      code: '0000',
      msg: 'Successfully loaded',
      data: data
    });

  } catch (error) {
    res.json({
      code: '1001',
      msg: 'Data retrieval failed~~',
      data: null,
      error: error.message
    });
  }
});


router.post('/account', async (req, res) => {
  try {
    const data = await AccountModel.create({
      ...req.body,
      time: moment(req.body.time).toDate()
    });

    res.json({
      code: '0000',
      msg: 'Successfully created',
      data: data
    });

  } catch (error) {
    res.json({
      code: '1002',
      msg: 'Failed to create~~',
      data: null,
      error: error.message
    });
  }
});


router.delete('/account/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteResult = await AccountModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount === 0) {
      return res.json({
        code: '1003',
        msg: 'Failed to delete the account. It may not exist',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: 'Deleted successfully',
      data: {}
    });

  } catch (error) {
    res.json({
      code: '5000',
      msg: 'Internal server error',
      data: null,
      error: error.message
    });
  }
});


router.get('/account/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AccountModel.findById(id);

    if (!data) {
      return res.json({
        code: '1004',
        msg: 'Data retrieval failed~~',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: 'Successfully loaded',
      data: data
    });

  } catch (error) {
    res.json({
      code: '5000',
      msg: 'Internal server error',
      data: null,
      error: error.message
    });
  }
});


router.patch('/account/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = await AccountModel.updateOne({ _id: id }, req.body);
    console.log(updateResult)
    if (updateResult.modifiedCount === 0 && updateResult.matchedCount===0) {
      return res.json({
        code: '1005',
        msg: 'Update failed~~',
        data: null
      });
    }

    const updatedData = await AccountModel.findById(id);

    if (!updatedData) {
      return res.json({
        code: '1004',
        msg: 'Data retrieval failed~~',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: 'Updated successfully',
      data: updatedData
    });

  } catch (error) {
    res.json({
      code: '5000',
      msg: 'Internal server error',
      data: null,
      error: error.message
    });
  }
});


module.exports = router;
