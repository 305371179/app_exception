const {expect} = require('chai')
var {connect} =require('../../utils/db')
connect(db=>{
  require('./models/user').test(db,expect)
})
