const express = require('express');
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const github = require('octonode');
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const user = require('../user');

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
router.post('/registerOrg', adminController.registerOrg);
router.get('/updateAvailableRepos', adminController.renderAvailableReposView);
router.post('/updateAvailableRepos', adminController.updateAvailableRepos);
router.get('/add', userController.renderAddIssueView);
router.post('/add', userController.addIssue);

module.exports = router;
