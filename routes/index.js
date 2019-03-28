const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.get('/',
  authController.isLoggedAndHasSavedCredentials,
  userController.renderSignUpView);
router.post('/sign-up',
  userController.validateRegister,
  userController.register,
  authController.login,
);
router.get('/login', userController.renderLoginView);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/register-org',
  authController.isLoggedIn,
  userController.renderRegisterOrgView);
router.post('/register-org',
  authController.isLoggedIn,
  adminController.registerOrg);
router.get('/update-repos',
  authController.isLoggedIn,
  authController.hasSavedCredentials,
  adminController.renderAvailableReposView);
router.get('/add-users',
  authController.isLoggedIn,
  adminController.renderAddUsersView);
router.post('/add-users',
  authController.isLoggedIn,
  adminController.addUsers);
router.post('/update-repos',
  authController.isLoggedIn,
  adminController.updateRepos);
router.get('/add-issue',
  authController.isLoggedIn,
  authController.hasSavedCredentials,
  userController.renderAddIssueView);
router.post('/add-issue',
  authController.isLoggedIn,
  userController.addIssue);
router.get('/reset-credentials', adminController.resetCredentials);
router.get('/settings',
  authController.isLoggedIn,
  adminController.renderSettingsView);

module.exports = router;
