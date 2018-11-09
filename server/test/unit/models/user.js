const {User} = require('../../../models/index').models
exports.test=(db,expect)=>{
  beforeEach(function() {
    return db.clear()
  });
  describe('user', () => {
    const user = new User({
      username:  'admin',
      password: 'admin'
    })

    it('create', (done) => {
      user.save(done)

    });

  });
}

