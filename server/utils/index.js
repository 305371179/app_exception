const sourceMap = require("source-map")
const fs = require('fs')
const config = require('../config')
const exceptionModel = require('../models/exception').model
const fileModel = require('../models/file').model
const sendEmail = require('../utils/mail').sendEmail

exports.parseException = (req, res, next) => {
  var {stack} = req.body
  if (!stack) {
    return res.send({
      message:'params is not right',
      code:422
    })
  }
  let strs=stack.split('\n')
  if(!strs.length){
    return res.send({
      message:'params is not right',
      code:422
    })
  }
  let message = strs[0]
  parseStack(stack, {}, res).then(({rawStack,frament,filename}) => {
    let sourceIndex = frament.sourceIndex
    let data = {
      stack,
      rawStack,
      message,
      ip:getIp(req),
      date:Date.now(),
      ua:req.headers['user-agent'],
      code:frament
    }
    // console.log(frament,5555)
    new exceptionModel(data).saveException((error,response)=>{
      if(error){
        res.send({
          message:error,
          code:422
        })
      }
      new fileModel({
        path:filename,
        sourceIndex,
        exceptionId:response._id
      }).saveFile()
      sendEmail(response,req,res,next,exceptionModel)
    res.send({
      message:'send Success',
      code:200,
      data:response
    })
    // res.send(response)
    })
  })
}
let parseFileName = path => {
  let match = path.match(/.*(dist\/static\/.*\.js$)/)
  if (match) return `${config.upload.path}/${match[1]}.map`
  return ''
}
function getIp(req) {
  // var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  // console.log(user_ip)

  let getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  };
  let ip = getClientIp(req)//.match(/\d+.\d+.\d+.\d+/);
  // ip = ip ? ip.join('.') : null;
  return ip
}
function parseSourceMap(map, filename, line, column, res) {
  return new Promise((resolve, reject) => {
    let content = map[filename]
    if (!content) {
      content = fs.readFileSync(filename, "utf8")
    }
    new sourceMap.SourceMapConsumer(content).then(function (consumer) {
      // console.log(consumer.sources);
      let sourceError = consumer.originalPositionFor({
        line: line,
        column: column
      })
      // callback(sourceError)
      resolve(sourceError)
    }).catch(e => {
      console.log(e)
      res.end('error:' + e, 'utf-8')
      reject(e)
    })
  })
}

async function parseStack(stack, map, res) {
  let match = stack.match(/(http.*:\d+:\d+)/g)
  return new Promise((resolve, reject) => {
    if (match) {
      var count = 0
      let frament = ''
      let files = []
      let sources = []
      match.forEach(async str => {
        let strs = str.split(':')
        let path = strs[0] + strs[1] + strs[2]
        let line = parseInt(strs[3])
        let column = parseInt(strs[4])
        let filename = parseFileName(path)
        // console.log(line,column,filename)
        if (!filename) {
          return res.end(`Can not find ${filename} source-map`)
        }
        let sourceError = await parseSourceMap(map, filename, line, column, res)
        sources.push(sourceError.source)
        stack = stack.replace(str, `${sourceError.source}:${sourceError.line}:${sourceError.column}`)
        if(!count){
          //解析该文件源码，并根据行列显示对应的代码片段
          frament = parseRawFrament(filename,map,sourceError)
          // console.log(filename,sourceError.source)
          // console.log(666)
        }
        files.push(filename)
        count++
        if (count === match.length) {
          resolve({rawStack:stack,frament,filename:files[0],source:sources[0]})
        }
      })
    } else {
      reject('error')
    }
  })
}
 function parseRawFrament(filename,map,{source,line,column}) {
  let content = map[filename]
  if (!content) {
    content = JSON.parse(fs.readFileSync(filename, "utf8"))
  }
  let sources = content.sources
  let index = sources.findIndex(item=>{
    // console.log(item===source)
    return item.replace('webpack:///','').indexOf(source.replace('webpack:///',''))!==-1
  })
  let code = content.sourcesContent[index]
  let strs = code.split('\n')
   // console.log(strs.length,line,column)
   let range = 4//附近的代码
   let row = line -1
   let col = column
   let lmin = row-range
   let lmax = row+range
   if(lmin<0)lmin=0
   if(lmax>strs.length-1)lmax = strs.length-1
   let codeArray = []
   for(let i = lmin;i<lmax;i++){
    // console.log(strs[i])
     codeArray.push(strs[i])
      // console.log(strs[i][col],444444)
   }
   // console.log(row,col)
  // console.log(code,index,source)
  return {codeArray,row:range,col,line,sourceIndex:index}
}



























