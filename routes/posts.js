const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');
module.exports = router;

const postsController = require('../controllers/posts_controller');

// router.get('/top', postsController.posts);

//code to create a post by this route
router.post('/create-post', passport.checkAuthentication,  postsController.createPost);

router.post('/delete-post', postsController.deletePost);
