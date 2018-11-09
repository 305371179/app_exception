// var mongoose = require('mongoose');
// var async = require('async');
var eventproxy = require('eventproxy')
var pageQuery = function (page=1, pageSize=2, Model, populate, queryParams, where, sortParams, callback,errCallback) {
  var start = (page - 1) * pageSize;
  var $page = {
    pageNumber: +page
  };
  console.log(queryParams)
  var ep = new eventproxy()
  ep.fail(errCallback)
  // ep.on('error',errCallback)
  ep.all('count','records',(total,records)=>{
    $page.pageCount = Math.floor((total - 1) / pageSize) + 1;
    $page.total = total
    $page.pageSize = pageSize
    $page.list = records;
    callback($page);
  })
  Model.find(queryParams).$where(where).count().exec(function (err, data) {
    if(err){
      console.log(err)
      return ep.emit('error',err)
    }
    // console.log(data,333)
    ep.emit('count',data);
  })
  Model.find(queryParams).skip(start).$where(where).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, data) {
    if(err){
      console.log(err)
      return ep.emit('error',err)
    }
    // console.log(data,5555)
    ep.emit('records',data);
  })
  //
  //
  //
  // async.parallel({
  //   count: function (done) {  // 查询数量
  //     Model.count(queryParams).exec(function (err, count) {
  //       done(err, count);
  //     });
  //   },
  //   records: function (done) {   // 查询一页的记录
  //     Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
  //       done(err, doc);
  //     });
  //   }
  // }, function (err, results) {
  //   var count = results.count;
  //   $page.pageCount = (count - 1) / pageSize + 1;
  //   $page.results = results.records;
  //   callback(err, $page);
  // });
};

module.exports = {
  pageQuery: pageQuery
};
