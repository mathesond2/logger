const currentOrgCredentials = require("./../orgCredentials.json");
const helpers = require("./../helpers");
const user = require("./../user");

exports.renderHomeView = (req, res) => {
  req.flash('success', "ayoby👺");
  // res.send(JSON.stringify(req.flash('success')));
  console.log(JSON.stringify(req.flash('success')));
  // console.log('res.locals', res.locals);
  res.render('index', { user: req.user });
}

exports.renderLoginView = (req, res) => {
  res.render('login');
}

exports.logInUser = (req, res) => { }

exports.signUpUser = (req, res) => { }

exports.renderAppHomeView = (req, res, next) => {
  Object.keys(currentOrgCredentials).length !== 0 &&
    user.correctCredentials !== false ?
    res.redirect('/add') :
    res.render('home', { user: req.user });
}

exports.renderAddIssueView = (req, res) => {
  user.filterUserData();
  res.render('add', { orgRepos: user.orgRepos });
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
    res.redirect('/add');
  });
}