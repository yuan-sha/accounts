var express = require('express');
var router = express.Router();
//导入 jwt
const jwt = require('jsonwebtoken');
//导入配置文件
const {secret} = require('../../config/config')
//导入 用户的模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');

//登录操作
router.post('/login', async (req, res) => {
  try {
    // 获取用户名和密码
    const { username, password } = req.body;

    // 查询数据库
    const data = await UserModel.findOne({
      username: username,
      password: md5(password)
    }).exec();

    // 判断 data 是否存在
    if (!data) {
      return res.json({
        code: '2002',
        msg: '用户名或密码错误~~~',
        data: null
      });
    }

    // 创建当前用户的 token
    const token = jwt.sign(
        {
          username: data.username,
          _id: data._id
        },
        secret,
        { expiresIn: '7d' } // 7 天过期
    );

    // 响应 token
    res.json({
      code: '0000',
      msg: '登录成功',
      data: token
    });

  } catch (error) {
    res.json({
      code: '2001',
      msg: '数据库读取失败~~~',
      data: null,
      error: error.message
    });
  }
});


//退出登录
router.post('/logout', async (req, res) => {
  try {
    // 使用 Promise 封装 session.destroy
    await new Promise((resolve) => req.session.destroy(resolve));

    // 退出成功，渲染成功页面
    res.render('success', { msg: '退出成功', url: '/login' });

  } catch (error) {
    res.json({
      code: '5000',
      msg: '退出失败~~',
      data: null,
      error: error.message
    });
  }
});


module.exports = router;
