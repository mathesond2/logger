const user = require("./../user");

exports.renderChangeCredentialView = (req, res) => {
  user.toggleCorrectCredentials();
  res.redirect('/home');
}

exports.updateAvailableRepos = (req, res) => {
  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      console.log('ERROR: ', err)
    } else {
      user.handleUserData(data);
      res.render('updateRepos', { orgRepos: user.orgRepos });
    }
  });
}