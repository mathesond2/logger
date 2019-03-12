const express = require('express');
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const github = require('octonode');
const fs = require("fs");
const helpers = require("./../helpers");
const currentOrgCredentials = require("./../orgCredentials.json");
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const user = require('../user');
let flashMessage;
let orgRepos = [];
let client;
let ghorg;
let correctCredentials;
let orgCredentials;
let correctAccessToken;

passport.use(new GitHubStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: "/login/github/callback"
},
  function (accessToken, refreshToken, profile, cb) {
    user.correctAccessToken = accessToken;
    user.client = github.client(accessToken);
    return cb(null, profile, accessToken);
  }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

function handleUserData(data) {
  orgRepos = [];
  data.forEach(function (obj) {
    var newObj = {
      name: obj.name,
      description: obj.description
    };
    orgRepos.push(newObj);
  });
  return orgRepos;
}

router.get('/', userController.renderHomeView);
router.get('/login', userController.renderLoginView);
router.post('/login', userController.logInUser);
router.post('/sign-up', userController.signUpUser);
router.get('/home', userController.renderAppHomeView);
router.get('/login/github', passport.authenticate('github', { scope: 'repo' }));

router.get('/login/github/callback',
  passport.authenticate('github', { failureRedirect: '/home' }),
  function (req, res) {
    res.redirect('/home');
  }
);

router.get('/changeCredentials', adminController.renderChangeCredentialView);

router.post('/registerOrg', function (req, res, next) {
  user.changeGithubOrg(req.body.orgName);
  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      req.flash('registerError', "Unable to register Github Org, please try again. 👺");
      // flashMessage = 'registerError';
      console.log(JSON.stringify(req.flash('registerError')));
      console.log(res.locals.flashes);
      res.redirect('/home');
    } else {
      user.orgCredentials.token = user.correctAccessToken;
      user.orgCredentials.orgName = req.body.orgName;
      fs.writeFile('orgCredentials.json', JSON.stringify(user.orgCredentials), 'utf8', function () { });
      user.correctCredentials = true;
      handleUserData(data);
      res.redirect('/updateAvailableRepos');
    }
  });
});

router.get('/updateAvailableRepos', adminController.renderAvailableReposView);
router.post('/updateAvailableRepos', adminController.updateAvailableRepos);

router.get('/add', function (req, res, next) {
  if (orgRepos.length === 0) {
    client = github.client(currentOrgCredentials.token);
    ghorg = client.org(currentOrgCredentials.orgName);
    ghorg.repos((err, data, headers) => {
      if (err) {
        console.log('ERROR: ', err)
      } else {
        handleUserData(data);
        orgRepos.forEach((obj, i) => {
          if (currentOrgCredentials.availableRepos && !currentOrgCredentials.availableRepos.includes(obj.name)) orgRepos.splice(i, 1);
        });
        res.render('add', { orgRepos });
      }
    });
  } else {
    res.render('add', { orgRepos, flashMessage: req.flash(flashMessage) });
  }
});

router.post('/add', function (req, res, next) {
  const ghrepo = client.repo(`${ghorg.name}/${req.body.repo}`);
  ghrepo.issue({
    "title": req.body.title,
    "body": req.body.description,
  }, function (err, data, headers) {
    const cleanUrl = data.html_url.replace('https://', '');
    req.flash('error', "Unable to create issue, please try again. 👺");
    req.flash('success', `Your issue has been created at <a href="${data.html_url}" target="_blank">${cleanUrl}</a>  🎉`);
    flashMessage = err ? 'error' : 'success';
    res.redirect('/add');
  });
});

module.exports = router;
