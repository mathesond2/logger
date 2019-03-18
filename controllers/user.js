const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("./../user");
const mongoose = require('mongoose');
const User = mongoose.model('User');

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

exports.validateRegister = (req, res, next) => {
  req.checkBody('email', 'Your email address is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password must not be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Confirmed Password must not be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Confirmed Password and Password must match!').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    console.log('errors', errors);
    // req.flash('error', errors.map(err => { err.msg }));
    res.render('/sign-up', {
      body: req.body,
      // flashes: req.flash();
    });
  }
  next();
}

exports.register = async (req, res, next) => {
  try {
    const user = new User({ email: req.body.email });
    // await register(user, req.body.password); //this 'register()' fn comes from 'passport-local-mongoose' doing the hashing and lower level stuff for us.
    await user.setPassword(req.body.password);
    await user.save();
  } catch (error) {
    console.log('error!', error);
  }
  next();
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