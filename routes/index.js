const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.get('/', userController.renderSignUpView);
router.post('/sign-up',
  userController.validateRegister,
  userController.register,
  authController.login,
);
router.get('/login', userController.renderLoginView);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/register-org', userController.renderRegisterOrgView);
router.post('/register-org', adminController.registerOrg);
router.get('/update-repos', loggedIn, adminController.renderAvailableReposView);
router.post('/update-repos', adminController.updateRepos);
router.get('/add-issue', loggedIn, userController.renderAddIssueView);
router.post('/add-issue', userController.addIssue);
router.get('/reset-credentials', adminController.resetCredentials);
router.get('/settings', adminController.renderSettingsView);

module.exports = router;
