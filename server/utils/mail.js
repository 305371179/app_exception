var nodemailer = require('nodemailer');
const config = require('../config')
const mail = config.mail
const mailTransport = nodemailer.createTransport(mail)
const emailModel = require('../models/email').model
exports.sendEmail = function (data, req, res, next,exceptionModel) {
  let dateFormat = new Date(data.date).Format('yyyy-MM-dd hh:mm:ss')
  data.stack = data.stack.replace(/\n/g,'<br>')
  data.rawStack = data.rawStack.replace(/\n/g,'<br>')
  let text = `异常时间：${dateFormat},<br>UA信息：${data.ua},<br>异常IP：${data.ip},<br>异常源码堆栈：<br>${data.rawStack},<br>异常生产堆栈：<br>${data.stack}`
  let to = ''

  new emailModel().findEmail(null,(err,response)=>{
    if(err){
      return console.log(err)
    }
    if(response.length>0){
      // console.log(response)
      response.forEach(item=>{
        if(item.email)
        to+=`${item.email},`
      })
      to = to.substr(0,to.length-1)
      let options = {
        from: config.mail.auth.user,
        to,
        subject: '发现精彩前端异常',
        // text
        html:`<div>${text}</div>`
      }
      mailTransport.sendMail(options, function (err, msg) {
        if (err) {
          console.log(err);
          // res.send(err);
        } else {
          // console.log(msg);
          exceptionModel.update({_id:data._id},{$set:{email:true}},(err,res)=>{
            if(err){
              return console.log(err)
            }
          })
          // res.send(msg);
        }
      });
    }
  })
}