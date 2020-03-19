const express = require('express');
const router = express.Router();
module.exports = router;

const userController = require('../controllers/users_controller');


router.get('/profile', userController.profile);
router.get('/settings', userController.settings);
