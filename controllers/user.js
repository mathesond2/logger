const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("./../user");
const github = require('octonode');
const fs = require("fs");

exports.renderLoginView = (req, res, next) => {
  res.render('login');
}


exports.renderSelectReposView = (req, res, next) => {
  let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  if (Object.keys(parsedData).length !== 0) {
    res.redirect('/add-issue');
  } else {
    async function getUserAdminRepos() {
      if (user && user.client && user.client.token) {
        let client = github.client(user.client.token);
        let ghUser = client.me();
        const orgsToCheck = await ghUser.orgsAsync();
        let reposToCheckPermissions = orgsToCheck[0].map(item => item.login);
        let allRepoRoles = reposToCheckPermissions.map(async (item) => {
          let ghorg = user.client.org(item);
          const result = await ghorg.membershipAsync(req.user.username);
          if (result[0].role === 'admin') return result[0].organization.login;
        });

        await Promise.all(allRepoRoles).then(data => {
          // console.log('data', data);
          const userOrgs = data.filter(item => typeof item === 'string');
          console.log('userOrgs', userOrgs);
          res.render('index', { user: req.user, userOrgs, flashes: req.flash() });
        });
      }
    }

    getUserAdminRepos();
  }
}

exports.renderAddIssueView = (req, res) => {
  if (Object.keys(currentOrgCredentials).length) {
    user.client = github.client(currentOrgCredentials.token);
    user.githubOrg = user.client.org(currentOrgCredentials.orgName);
    user.githubOrg.repos((err, data, headers) => {
      if (err) {
        console.log('ERROR: ', err)
      } else {
        user.handleUserData(data);
        user.filterUserData();
        res.render('add-issue', { orgRepos: user.orgRepos });
      }
    });
  } else {
    res.render('add-issue', { orgRepos: user.orgRepos });
  }
}

exports.addIssue = (req, res) => {
  const ghrepo = user.client.repo(`${user.githubOrg.name}/${req.body.repo}`);
  ghrepo.issue({
    "title": req.body.title,
    "body": req.body.description,
  }, function (err, data, headers) {
    if (err) {
      req.flash('error', "Unable to create issue, please try again. 👺");
    } else {
      const cleanUrl = data.html_url.replace('https://', '');
      req.flash('success', `Your issue has been created at <a href="${data.html_url}" target="_blank">${cleanUrl}</a>  🎉`);
      res.redirect('/add-issue');
    }
  });
}