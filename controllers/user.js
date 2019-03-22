const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("./../user");
const github = require('octonode');
const fs = require("fs");

// exports.renderAppHomeView = (req, res, next) => {
//   let userOrgs;
//   let ghUser = user.client.me();
//   ghUser.orgs((err, data, headers) => {
//     userOrgs = data.map(obj => obj.login);
//     // Object.keys(currentOrgCredentials).length !== 0 &&
//     //   user.correctCredentials !== false ?
//     //   res.redirect('/add') :
//     //   res.render('home', { user: req.user, userOrgs });
//   });
// }

exports.renderAppHomeView = (req, res, next) => {
  let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  let userOrgs = [];
  if (Object.keys(parsedData).length !== 0) {
    res.redirect('/add-issue');
  } else {
    if (user && user.client && user.client.token) {
      let client = github.client(user.client.token);
      let ghUser = client.me();
      const blah = function (cb) {
        ghUser.orgs((err, data, headers) => {
          return cb(data);
        });
      };

      // let bleh = blah();
      // console.log(bleh);


      // let ghUser = user.client.me();
      // ghUser.orgs((err, data, headers) => {
      //   userOrgs = data.map(obj => obj.login);

      // });
      blah(loggit);
    }

    function loggit(data) {
      const reposToCheckPermissions = data.map(item => item.login);
      reposToCheckPermissions.map((item) => {
        let ghorg = user.client.org(item);
        const bleh = function (cb) {
          ghorg.membership('mathesond2', (err, data, headers) => {
            cb(data);
          });
        }

        bleh(dude);
      });






      // userOrgs = simpleArr;
      // console.log('userOrgs', userOrgs);
    }
    let simpleArr = [];
    function dude(data) {
      if (data.role === 'admin') simpleArr.push(data.organization.login);
      console.log(simpleArr);
    }

    res.render('index', { user: req.user, userOrgs, flashes: req.flash() });
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