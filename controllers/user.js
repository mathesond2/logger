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

exports.logInUser = (req, res) => {
  console.log(req.body);
}

exports.signUpUser = (req, res) => {
  console.log(req.body);
}

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