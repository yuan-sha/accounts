/**
 *
 * @param {*} success Callback function for a successful database connection
 * @param {*} error Callback function for a failed database connection
 */
module.exports = function (success, error) {
  // Check if error is undefined and set a default value
  if(typeof error !== 'function'){
    error = () => {
      console.log('连接失败~~~');
    }
  }
  //1. install mongoose
  //2. import mongoose
  const mongoose = require('mongoose');
  //import config file
  const {DBHOST, DBPORT, DBNAME} = require('../config/config.js');

  //set strictQuery = true
  mongoose.set('strictQuery', true);

  //3. connect mongodb                       database information
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

  // 4. Set callback functions
  // Set the callback for a successful connection
  // `once` means the event callback function will only execute once
  mongoose.connection.once('open', () => {
    success();
  });

  // Set the callback for a connection error
  mongoose.connection.on('error', () => {
    error();
  });

  // Set the callback for connection closure
  mongoose.connection.on('close', () => {
    console.log('连接关闭');
  });
}