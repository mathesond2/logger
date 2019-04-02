const passport = require('passport');
const fs = require("fs");

//strategy = something will interface with checking if you're allowed to login.
exports.login = passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
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
  res.redirect('/');
}

exports.hasSavedCredentials = (req, res, next) => {
  let currentCredentials = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  if (Object.keys(currentCredentials).length) {
    next();
    return;
  }
  req.flash('error', 'You must register your organization to do that! 👺');
  res.redirect('/register-org');
}

exports.isLoggedAndHasSavedCredentials = (req, res, next) => {
  let currentCredentials = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  if (!req.isAuthenticated()) {
    next();
    return;
  }

  if (req.isAuthenticated() && Object.keys(currentCredentials).length > 0) {
    if (Object.keys(currentCredentials).includes('availableRepos')) {
      res.redirect('/add-issue');
    }
    res.redirect('/update-repos');
  }
  res.redirect('/register-org');
}