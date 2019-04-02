const currentOrgCredentials = require("./../orgCredentials.json");
const user = require("../public/javascripts/user");
const fs = require("fs");
const github = require('octonode');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.resetCredentials = (req, res) => {
  user.removeCredentials();
  req.flash('success', "Credentials reset! 🎉");
  res.redirect('/register-org');
}

exports.renderAvailableReposView = (req, res) => {
  const parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  user.client = github.client(parsedData.token);
  user.githubOrg = user.client.org(parsedData.orgName); //TODO: analyze this redundancy

  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      console.log('ERROR: ', err)
    } else {
      user.handleUserData(data);
      res.render('update-repos', { user: req.user, orgRepos: user.orgRepos });
    }
  });
}

exports.renderAddUsersView = (req, res) => {
  res.render('add-users', { user: req.user });
}

exports.validateRegisterUsers = (req, res, next) => {
  Object.keys(req.body).map((item, i) => {
    if (req.body[item] !== '' && item !== 'password') {
      req.checkBody('password', 'Password must not be blank! 👺').notEmpty();
      req.checkBody(`email${i}`, `email address "${req.body[item]}" is not valid! 👺`).isEmail();
      req.sanitizeBody(`email${i}`).normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false,
      });

      const errors = req.validationErrors();

      if (errors) {
        console.log('errors', errors);
        errors.map(err => { req.flash(`Error: ${err.msg} 👺`); });
        res.render('add-users', {
          body: req.body,
          flashes: req.flash(),
        });
        return;
      }
    }
  });
  next();
}

exports.registerUsers = async (req, res, next) => {
  Object.keys(req.body).map(async (item) => {
    if (req.body[item] !== '' && item !== 'password') {
      try {
        const user = new User({ email: req.body[item] });
        const register = promisify(User.register, User);
        await register(user, req.body.password);  //this 'register()' fn comes from 'passport-local-mongoose' doing the hashing and lower level stuff for us.
        await user.setPassword(req.body.password);
        await user.save();
      } catch (error) {
        req.flash(`Error: ${error} 👺`);
        res.redirect(`/add-users`);
        res.render('add-users', {
          body: req.body,
          flashes: req.flash(),
        });
        return;
      }
    }
  });

  req.flash('success', 'success! 🎉');
  res.redirect(`/add-users`);
}

exports.updateRepos = (req, res) => {
  console.log('req.body.repos', req.body.repos);
  let availableRepos = typeof (req.body.repos) === 'object' ? req.body.repos : [req.body.repos];
  user.orgRepos.forEach((obj, i) => {
    if (!availableRepos.includes(obj.name)) user.orgRepos.splice(i, 1);
  });

  if (user.orgCredentials) {
    if (Object.keys(currentOrgCredentials).length) {
      user.orgCredentials.token = currentOrgCredentials.token;
      user.orgCredentials.orgName = currentOrgCredentials.orgName;
    }
    user.orgCredentials.availableRepos = availableRepos;
    fs.writeFile('orgCredentials.json', JSON.stringify(user.orgCredentials), 'utf8', function () { });
  }
  res.redirect('/add-issue');
}

exports.registerOrg = (req, res) => {
  user.client = github.client(req.body.token);
  user.changeGithubOrg(req.body.orgName);
  user.githubOrg.repos((err, data, headers) => {
    if (err) {
      req.flash('error', 'Unable to register your Github Org, please try again. 👺');
      res.redirect('/register-org');
    } else {
      user.orgCredentials.token = req.body.token;
      user.orgCredentials.orgName = req.body.orgName;
      fs.writeFile('orgCredentials.json', JSON.stringify(user.orgCredentials), 'utf8', function () { });
      user.handleUserData(data);
      res.redirect('/update-repos');
    }
  });
}

exports.renderSettingsView = (req, res) => {
  res.render('settings', { user: req.user });
}
