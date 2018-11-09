const mongoose = require('mongoose')
const {host,port,dbname} = require('../config').mongodb
//连接相应数据库，在这里连接的是student_dormitory数据库
var connectionStr = `mongodb://${host}:${port}/${dbname}`
mongoose.connect(connectionStr,{ useNewUrlParser: true } );

module.exports = {
  connect: async (cb)=>{
    var db = mongoose.connection
// 链接错误
    db.on('error', function(error) {
      console.log(error);
    });
    db.once('open', function() {
      console.log("数据库连接成功");
      require('../models')
      cb&&cb(db)
    });
  }
};