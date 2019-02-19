var express = require('express');
var router = express.Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var clientID = process.env.GITHUB_CLIENT_ID;
var clientSecret = process.env.GITHUB_CLIENT_SECRET;
var github = require('octonode');
var client;
var ghorg;
var myArr = [];


passport.use(new GitHubStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: "/login/github/callback"
},
  function (accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    client = github.client(accessToken);
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

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/add', function (req, res, next) {
  console.log('myArr', myArr);
  res.render('add', { user: req.user, blah: myArr });
});

router.post('/registerOrg', function (req, res, next) {
  ghorg = client.org(req.body.orgName);
  ghorg.repos(function (err, data, headers) {
    handleData(data);
    res.redirect('/add');
  });

  function handleData(data) {
    data.forEach(function (obj) {
      var newObj = {
        name: obj.name,
        url: obj.url
      };
      myArr.push(newObj);
    });
    return myArr;
  }
});

router.get('/login/github',
  passport.authenticate('github'));

router.get('/login/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);

module.exports = router;
