const passport = require('passport');

//strategy = something will interface with checking if you're allowed to login.
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/register-org',
  successFlash: 'you are logged in! 🎉',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', "you're logged out! 🏄‍♂️");
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in to do that! 👺');
  res.redirect('/login');

}