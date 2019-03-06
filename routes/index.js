const express = require('express');
const router = express.Router();
const github = require('octonode');
const fs = require("fs");
const currentOrgCredentials = require("./../orgCredentials.json");
let flashMessage;
let orgRepos = [];
let client;
let ghorg;
let correctCredentials;
let orgCredentials;

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
  Object.keys(currentOrgCredentials).length !== 0 && correctCredentials !== false ? res.redirect('/add') : res.render('index', { flashMessage: req.flash(flashMessage) });
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
      req.flash('error', "Unable to register Github Org, please try again. 😔");
      flashMessage = 'error';
      res.redirect('/');
    } else {
      orgCredentials = {
        token: req.body.token,
        orgName: req.body.orgName,
      };
      fs.writeFile('orgCredentials.json', JSON.stringify(orgCredentials), 'utf8', function () { });
      correctCredentials = true;
      handleUserData(data);
      // res.redirect('/add');
      res.redirect('/updateAvailableRepos');
    }
  });
});

router.get('/updateAvailableRepos', function (req, res, next) {
  if (orgRepos.length === 0) {
    client = github.client(currentOrgCredentials.token);
    ghorg = client.org(currentOrgCredentials.orgName);
    ghorg.repos((err, data, headers) => {
      if (err) {
        console.log('ERROR: ', err)
      } else {
        handleUserData(data);
        res.render('updateRepos', { orgRepos });
      }
    });
  } else {
    res.render('updateRepos', { orgRepos, flashMessage: req.flash(flashMessage) });
  }
});


router.post('/updateAvailableRepos', function (req, res, next) {
  // console.log('orgRepos', orgRepos);
  // let availableRepos = [];
  // let blah = JSON.parse(req.body.repos);
  // let myArr = [];
  // console.log('req.body.repos', req.body.repos);
  // console.log('typeof  req.body.repos', typeof (req.body.repos));
  let availableRepos = typeof (req.body.repos) === 'object' ? req.body.repos : [req.body.repos];
  // console.log('blah', availableRepos);
  orgRepos.forEach((obj, i) => {
    if (!availableRepos.includes(obj.name)) orgRepos.splice(i, 1);
  });
  // console.log('orgRepos NOW', orgRepos);




  // let blah = typeof (req.body.repos) === 'object' ? Object.keys(req.body.repos).map(i => req.body.repos[i]) : JSON.parse(req.body.repos);
  // console.log('blah', blah);
  // console.log(Object.values(blah));
  // let ha = Object.values(blah).length < 2 ? blah.name : blah.name;
  // console.log('ha', ha);
  // const peopleArray = Object.keys(req.body.repos).map(i => req.body.repos[i]);
  // const peopleArray = Object.keys(req.body.repos).map(i => req.body.repos[i]);
  // console.log('peopleArray', peopleArray);
  // console.log('typeof peopleArray', typeof (peopleArray));

  // let myArr = [blah];
  // let myArr = Object.keys(blah).map(i => blah[i]);
  // console.log('myArr', myArr);

  // myArr.forEach((obj, i) => {

  // console.log('obj', obj);
  //   console.log('typeof obj', typeof (obj));
  //   console.log('name is', obj["name"]);
  //   availableRepos.push(obj["name"]);
  // });

  // console.log('availableRepos', availableRepos);
  orgCredentials.availableRepos = availableRepos;
  // orgRepos.forEach((obj, i) => {
  //   // if (!currentOrgCredentials.availableRepos.includes(obj.name)) orgRepos.splice(i, 1);

  // });


  fs.writeFile('orgCredentials.json', JSON.stringify(orgCredentials), 'utf8', function () { });
  res.redirect('/add');
});

router.get('/add', function (req, res, next) {
  // console.log('availableRepos', availableRepos);
  console.log('orgRepos', orgRepos);
  console.log('currentOrgCredentials.availableRepos', currentOrgCredentials.availableRepos);

  if (orgRepos.length === 0) {
    client = github.client(currentOrgCredentials.token);
    ghorg = client.org(currentOrgCredentials.orgName);
    ghorg.repos((err, data, headers) => {
      if (err) {
        console.log('ERROR: ', err)
      } else {
        handleUserData(data);
        // orgRepos.forEach((obj, i) => {
        //   if (!currentOrgCredentials.availableRepos.includes(obj.name)) orgRepos.splice(i, 1);
        // });
        orgRepos.forEach((obj, i) => {
          if (currentOrgCredentials.availableRepos && !currentOrgCredentials.availableRepos.includes(obj.name)) orgRepos.splice(i, 1);
        });
        res.render('add', { orgRepos });
      }
    });
  } else {
    // orgRepos.forEach((obj, i) => {
    //   if (availableRepos.length && !availableRepos.includes(obj["name"])) {
    //     orgRepos.splice(i, 1);
    //   }
    // });
    res.render('add', { orgRepos, flashMessage: req.flash(flashMessage) });
  }
});

router.post('/add', function (req, res, next) {
  const ghrepo = client.repo(`${ghorg.name}/${req.body.repo}`);
  ghrepo.issue({
    "title": req.body.title,
    "body": req.body.description,
  }, function (err, data, headers) {
    req.flash('error', "Unable to create issue, please try again. 😔");
    req.flash('success', `Your issue has been posted at <a href="${data.html_url}">${data.html_url}</a>  🎉`);
    flashMessage = err ? 'error' : 'success';
    res.redirect('/add');
  });
});

module.exports = router;
