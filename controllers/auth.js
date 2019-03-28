const passport = require('passport');

//strategy = something will interface with checking if you're allowed to login.
exports.login = passport.authenticate('local', {
  failureRedirect: '/sign-up',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'you are logged in!',
});