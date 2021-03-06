const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/users_controller');

console.log('users route');

//making the profile page accessible only when the user is signed in
router.get('/profile', passport.checkAuthentication,  userController.profile);

router.get('/settings', userController.settings);
router.get('/signup', userController.signup);
router.get('/signin', userController.signin);
router.post('/create-user',  userController.createUser);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'},
), userController.createSession);

router.get('/sign-out', userController.destroySession);

//for updating profile
router.post('/profile/update/', passport.checkAuthentication, userController.updateProfile);

//for google oauth
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email', ]}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/users/signin'}), userController.createSession);

module.exports = router;