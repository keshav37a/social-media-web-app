const express = require('express');
const users_api_controller = require('../../../controllers/api/v1/users_api');
const router = express.Router();

router.post('/create-session', users_api_controller.createSession);

module.exports = router;