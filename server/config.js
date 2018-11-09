module.exports = {
  mongodb: {
    host:'127.0.0.1',
    port:'27017',
    dbname:'exception'
  },
  mail: {
    host : 'smtp.sina.com',
    secureConnection: false, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
      user : 'guangfa_cgb@sina.com',
      pass : '12345678'
    }
  }
}