//Import jwt
const jwt = require('jsonwebtoken');
// Read configuration settings
const {secret} = require('../config/config');
// Declare middleware
module.exports = (req, res, next) => {
  //Get token
  let token = req.get('token');
  if (!token) {
    return res.json({
      code: '2003',
      msg: 'token 缺失',
      data: null
    })
  }
  //Verify token
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      return res.json({
        code: '2004',
        msg: 'token 校验失败~~',
        data: null
      })
    }
    //Save user information
    req.user = data; // req.session  req.body
    //If the token verification is successful
    next();
  });
}