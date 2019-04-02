const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("../public/javascripts/user");
const github = require('octonode');
const fs = require("fs");
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.validateRegister = (req, res, next) => {
  req.checkBody('email', 'Your email address is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });

  req.checkBody('password', 'Password must not be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Confirmed Password must not be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Passwords must match!').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    console.log('errors', errors);
    errors.map(err => { req.flash('error', err.msg); });
    res.render('index', {
      body: req.body,
      flashes: req.flash(),
    });
    return;
  }
  next();
}

exports.register = async (req, res, next) => {
  try {
    const user = new User({ email: req.body.email });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    await user.setPassword(req.body.password);
    await user.save();
  } catch (error) {
    console.log('error!', error);
  }
  next();
}

exports.renderRegisterOrgView = (req, res, next) => {
  res.render('register-org', { user: req.user });
}

exports.renderLoginView = (req, res, next) => {
  res.render('login', { user: req.user });
}

exports.renderSignUpView = (req, res, next) => {
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
        res.render('add-issue', { user: req.user, orgRepos: user.orgRepos });
      }
    });
  } else {
    res.render('add-issue', { user: req.user, orgRepos: user.orgRepos });
  }
}

exports.addIssue = (req, res) => {
  const ghrepo = user.client.repo(`${user.githubOrg.name}/${req.body.repo}`);
  const msgToSend = `${req.body.description}\n\n issue created by ${req.body.email} via Roger App.`;
  ghrepo.issue({
    "title": req.body.title,
    "body": msgToSend,
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