const user = require("./../user");

exports.renderChangeCredentialView = (req, res) => {
  user.toggleCorrectCredentials();
  res.redirect('/home');
}