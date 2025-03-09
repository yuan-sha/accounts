const express = require('express');

const jwt = require('jsonwebtoken');

let checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

const router = express.Router();

const moment = require('moment');

const AccountModel = require('../../models/AccountModel');

router.get('/account', checkTokenMiddleware, async (req, res) => {
  try {
    const data = await AccountModel.find().sort({ time: -1 }).exec();

    res.json({
      code: '0000',
      msg: '读取成功',
      data: data
    });

  } catch (error) {
    res.json({
      code: '1001',
      msg: '读取失败~~',
      data: null,
      error: error.message
    });
  }
});


router.post('/account', checkTokenMiddleware, async (req, res) => {
  try {
    const data = await AccountModel.create({
      ...req.body,
      time: moment(req.body.time).toDate()
    });

    res.json({
      code: '0000',
      msg: '创建成功',
      data: data
    });

  } catch (error) {
    res.json({
      code: '1002',
      msg: '创建失败~~',
      data: null,
      error: error.message
    });
  }
});


router.delete('/account/:id', checkTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteResult = await AccountModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount === 0) {
      return res.json({
        code: '1003',
        msg: '删除账单失败，可能该账单不存在',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: '删除成功',
      data: {}
    });

  } catch (error) {
    res.json({
      code: '5000',
      msg: '服务器错误',
      data: null,
      error: error.message
    });
  }
});


router.get('/account/:id', checkTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AccountModel.findById(id);

    if (!data) {
      return res.json({
        code: '1004',
        msg: '读取失败~~',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: '读取成功',
      data: data
    });

  } catch (error) {
    res.json({
      code: '5000',
      msg: '服务器错误',
      data: null,
      error: error.message
    });
  }
});


router.patch('/account/:id', checkTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = await AccountModel.updateOne({ _id: id }, req.body);
    console.log(updateResult)
    if (updateResult.modifiedCount === 0 && updateResult.matchedCount===0) {
      return res.json({
        code: '1005',
        msg: '更新失败~~',
        data: null
      });
    }

    const updatedData = await AccountModel.findById(id);

    if (!updatedData) {
      return res.json({
        code: '1004',
        msg: '读取失败~~',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: '更新成功',
      data: updatedData
    });

  } catch (error) {
    res.json({
      code: '5000',
      msg: '服务器错误',
      data: null,
      error: error.message
    });
  }
});


module.exports = router;
