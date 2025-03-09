//Import express
const express = require('express');
//Import jwt
const jwt = require('jsonwebtoken');
//Import middleware
let checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

const router = express.Router();
//Import moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

//记账本的列表
router.get('/account', checkTokenMiddleware, async (req, res) => {
  try {
    // 读取集合信息，并按时间降序排序
    const data = await AccountModel.find().sort({ time: -1 }).exec();

    // 成功响应
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


//新增记录
router.post('/account', checkTokenMiddleware, async (req, res) => {
  try {
    // 表单验证（可在此处添加）

    // 插入数据库
    const data = await AccountModel.create({
      ...req.body,
      // 修改 time 属性的值
      time: moment(req.body.time).toDate()
    });

    // 成功响应
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


//删除记录
router.delete('/account/:id', checkTokenMiddleware, async (req, res) => {
  try {
    // 获取 id 参数
    const { id } = req.params;

    // 删除数据
    const deleteResult = await AccountModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount === 0) {
      return res.json({
        code: '1003',
        msg: '删除账单失败，可能该账单不存在',
        data: null
      });
    }

    // 成功响应
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


//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, async (req, res) => {
  try {
    // 获取 id 参数
    const { id } = req.params;

    // 查询数据库
    const data = await AccountModel.findById(id);

    if (!data) {
      return res.json({
        code: '1004',
        msg: '读取失败~~',
        data: null
      });
    }

    // 成功响应
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


//更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware, async (req, res) => {
  try {
    // 获取 id 参数值
    const { id } = req.params;

    // 更新数据库
    const updateResult = await AccountModel.updateOne({ _id: id }, req.body);
    console.log(updateResult)
    if (updateResult.modifiedCount === 0 && updateResult.matchedCount===0) {
      return res.json({
        code: '1005',
        msg: '更新失败~~',
        data: null
      });
    }

    // 再次查询数据库获取单条数据
    const updatedData = await AccountModel.findById(id);

    if (!updatedData) {
      return res.json({
        code: '1004',
        msg: '读取失败~~',
        data: null
      });
    }

    // 成功响应
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
