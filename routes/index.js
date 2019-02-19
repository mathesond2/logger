const express = require('express');
const router = express.Router();
const github = require('octonode');
let client;
let ghorg;
let orgRepos = [];

router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});

router.post('/registerOrg', function (req, res, next) {
  client = github.client(req.body.token);
  ghorg = client.org(req.body.orgName);
  ghorg.repos((err, data, headers) => {
    handleUserData(data);
    res.redirect('/add');
  });

  function handleUserData(data) {
    data.forEach(function (obj) {
      var newObj = { name: obj.name };
      orgRepos.push(newObj);
    });
    return orgRepos;
  }
});

router.get('/add', function (req, res, next) {
  // console.log('orgRepos', orgRepos);
  res.render('add', { user: req.user, orgRepos });
});

router.post('/add', function (req, res, next) {
  const ghrepo = client.repo(`${ghorg.name}/${req.body.repo}`);
  ghrepo.issue({
    "title": req.body.title,
    "body": req.body.description,
  }, function () {
    res.redirect('/add');
  });
});

module.exports = router;
