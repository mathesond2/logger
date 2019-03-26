const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const fs = require("fs");

function loggedIn(req, res, next) {
  let currentCredentials = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  (req.user || Object.keys(currentCredentials).length) ? next() : res.redirect('/');
}

router.get('/', userController.renderLoginView);
router.post('/registerOrg', adminController.registerOrg);
router.get('/update-repos', loggedIn, adminController.renderAvailableReposView);
router.post('/update-repos', adminController.updateRepos);
router.get('/add-issue', loggedIn, userController.renderAddIssueView);
router.post('/add-issue', userController.addIssue);
router.get('/reset-credentials', adminController.resetCredentials);
router.get('/settings', adminController.renderSettingsView);

module.exports = router;
