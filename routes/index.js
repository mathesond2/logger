const express = require('express');
const router = express.Router();
const github = require('octonode');
const fs = require("fs");
const currentOrgCredentials = require("./../orgCredentials.json");
let client;
let ghorg;
let orgRepos = [];
let correctCredentials;

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

router.get('/', function (req, res, next) {
  Object.keys(currentOrgCredentials).length !== 0 && correctCredentials !== false ? res.redirect('/add') : res.render('index');
});

router.get('/changeCredentials', function (req, res, next) {
  correctCredentials = false;
  res.redirect('/');
});

router.post('/registerOrg', function (req, res, next) {
  client = github.client(req.body.token);
  ghorg = client.org(req.body.orgName);
  ghorg.repos((err, data, headers) => {
    if (err) {
      res.redirect('/');
    } else {
      const orgCredentials = {
        token: req.body.token,
        orgName: req.body.orgName,
      };
      fs.writeFile('orgCredentials.json', JSON.stringify(orgCredentials), 'utf8', function () { });
      correctCredentials = true;
      handleUserData(data);
      res.redirect('/add');
    }
  });
});

router.get('/add', function (req, res, next) {
  if (orgRepos.length === 0) {
    client = github.client(currentOrgCredentials.token);
    ghorg = client.org(currentOrgCredentials.orgName);
    ghorg.repos((err, data, headers) => {
      if (err) {
        console.log('ERROR: ', err)
      } else {
        handleUserData(data);
        res.render('add', { user: req.user, orgRepos });
      }
    });
  } else {
    res.render('add', { user: req.user, orgRepos });
  }
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
