exports.createUserModel= function (mongoose,Schema) {
  const options={
    username:  String,
    password: String
  }
  var modelSchema = new Schema(options,{ autoIndex: false,versonKey:false });
  // modelSchema.methods.saveUser =  function(cb) {
  //   return this.save(this, cb);
  // };
  // modelSchema.methods.findUser = function(options={},cb) {
  //   return this.find(options).exec(cb);
  // };
  // modelSchema.methods.updateUser = function(options,newOptions,cb) {
  //   return this.update(options,{$set:newOptions}).exec(cb);
  // };
  return mongoose.model('user', modelSchema)
}
