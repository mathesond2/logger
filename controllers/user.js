const currentOrgCredentials = require("./../orgCredentials.json");
const helpers = require("./../helpers");
const user = require("./../user");
let flashMessage;
let correctCredentials;

exports.renderHomeView = (req, res) => {
  res.render('index', { user: req.user, flashMessage: req.flash(flashMessage) });
}

exports.renderLoginView = (req, res) => {
  res.render('login', { flashMessage: req.flash(flashMessage) });
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
    res.render('home', { user: req.user, flashMessage: req.flash(flashMessage) });
}
