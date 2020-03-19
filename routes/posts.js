const express = require('express');
const router = express.Router();
module.exports = router;

const postsController = require('../controllers/posts_controller');

router.get('/top', postsController.posts);
