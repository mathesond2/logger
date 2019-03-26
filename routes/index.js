const express = require('express');
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const github = require('octonode');
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const user = require('../public/javascripts/user');
const fs = require("fs");

passport.use(new GitHubStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  // callbackURL: "/login/github/callback",
  scope: 'repo',
},
  (accessToken, refreshToken, profile, cb) => {
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
passport.serializeUser((user, cb) => { cb(null, user); });
passport.deserializeUser((obj, cb) => { cb(null, obj); });

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

router.get('/login/github', passport.authenticate('github'));
router.get('/login/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/select-repos'); }
);

function loggedIn(req, res, next) {
  let currentCredentials = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  (req.user || Object.keys(currentCredentials).length) ? next() : res.redirect('/');
}

router.get('/', userController.renderLoginView);
router.get('/select-repos', loggedIn, userController.renderAppHomeView);
router.post('/registerOrg', adminController.registerOrg);
router.get('/update-repos', loggedIn, adminController.renderAvailableReposView);
router.post('/update-repos', adminController.updateRepos);
router.get('/add-issue', loggedIn, userController.renderAddIssueView);
router.post('/add-issue', userController.addIssue);
router.get('/reset-credentials', adminController.resetCredentials);
router.get('/admin', adminController.renderAdminView);

module.exports = router;
