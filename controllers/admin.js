const user = require("./../user");
const fs = require("fs");

exports.renderChangeCredentialView = (req, res) => {
  user.toggleCorrectCredentials();
  res.redirect('/home');
}

exports.renderAvailableReposView = (req, res) => {
  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      console.log('ERROR: ', err)
    } else {
      user.handleUserData(data);
      res.render('updateRepos', { orgRepos: user.orgRepos });
    }
  });
}

exports.updateAvailableRepos = (req, res) => {
  let availableRepos = typeof (req.body.repos) === 'object' ? req.body.repos : [req.body.repos];
  user.orgRepos.forEach((obj, i) => {
    if (!availableRepos.includes(obj.name)) user.orgRepos.splice(i, 1);
  });
  if (user.orgCredentials) {
    user.orgCredentials.availableRepos = availableRepos;
    fs.writeFile('orgCredentials.json', JSON.stringify(user.orgCredentials), 'utf8', function () { });
  }
  res.redirect('/add');
}