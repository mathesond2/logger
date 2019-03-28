const passport = require('passport');

//strategy = something will interface with checking if you're allowed to login.
exports.login = passport.authenticate('local', {
  failureRedirect: '/sign-up',
  failureFlash: 'Failed Login!',
  successRedirect: '/register-org',
  successFlash: 'you are logged in! 🎉',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', "you're logged out! 🏄‍♂️");
  res.redirect('/');
}
