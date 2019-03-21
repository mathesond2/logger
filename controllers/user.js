const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("./../user");
const github = require('octonode');

// exports.renderHomeView = (req, res) => {
//   req.flash('success', "ayoby👺");
//   // res.send(JSON.stringify(req.flash('success')));
//   console.log(JSON.stringify(req.flash('success')));
//   // console.log('res.locals', res.locals);
//   res.render('index', { user: req.user });
// }

exports.renderAppHomeView = (req, res, next) => {
  Object.keys(currentOrgCredentials).length !== 0 ?
    res.redirect('/add-issue') :
    res.render('index', { user: req.user });
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
    const cleanUrl = data.html_url.replace('https://', '');
    req.flash('error', "Unable to create issue, please try again. 👺");
    req.flash('success', `Your issue has been created at <a href="${data.html_url}" target="_blank">${cleanUrl}</a>  🎉`);
    flashMessage = err ? 'error' : 'success';
    res.redirect('/add-issue');
  });
}