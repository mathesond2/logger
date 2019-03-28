const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("../public/javascripts/user");
const fs = require("fs");
const github = require('octonode');

exports.resetCredentials = (req, res) => {
  user.removeCredentials();
  res.redirect('/register-org');
}

exports.renderAvailableReposView = (req, res) => {
  const parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  user.client = github.client(parsedData.token);
  user.githubOrg = user.client.org(parsedData.orgName); //TODO: analyze this redundancy

  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      console.log('ERROR: ', err)
    } else {
      user.handleUserData(data);
      res.render('update-repos', { orgRepos: user.orgRepos });
    }
  });
}

exports.updateRepos = (req, res) => {
  console.log('req.body.repos', req.body.repos);
  let availableRepos = typeof (req.body.repos) === 'object' ? req.body.repos : [req.body.repos];
  user.orgRepos.forEach((obj, i) => {
    if (!availableRepos.includes(obj.name)) user.orgRepos.splice(i, 1);
  });

  if (user.orgCredentials) {
    if (Object.keys(currentOrgCredentials).length) {
      user.orgCredentials.token = currentOrgCredentials.token;
      user.orgCredentials.orgName = currentOrgCredentials.orgName;
    }
    user.orgCredentials.availableRepos = availableRepos;
    fs.writeFile('orgCredentials.json', JSON.stringify(user.orgCredentials), 'utf8', function () { });
  }
  res.redirect('/add-issue');
}

exports.registerOrg = (req, res) => {
  user.client = github.client(req.body.token);
  user.changeGithubOrg(req.body.orgName);
  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      req.flash('error', 'Unable to register your Github Org, please try again. 👺');
      res.redirect('/register-org');
    } else {
      user.orgCredentials.token = req.body.token;
      user.orgCredentials.orgName = req.body.orgName;
      fs.writeFile('orgCredentials.json', JSON.stringify(user.orgCredentials), 'utf8', function () { });
      user.handleUserData(data);
      res.redirect('/update-repos');
    }
  });
}

exports.renderSettingsView = (req, res) => {
  res.render('settings');
}
