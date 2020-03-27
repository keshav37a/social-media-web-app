const express = require('express');
const router = express.Router();
module.exports = router;

const userController = require('../controllers/users_controller');


router.get('/profile', userController.profile);
router.get('/settings', userController.settings);
router.get('/signup', userController.signup);
router.get('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/create-session', userController.loginForm);
router.post('/create-user', userController.signupForm);
