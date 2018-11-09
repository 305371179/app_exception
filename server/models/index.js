const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {createUserModel} = require('./user')

const models = exports.models = {
  User: createUserModel(mongoose,Schema)
}

