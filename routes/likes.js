const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likes_controller');

router.post('/like-post', likesController.likePost);
router.post('/unlike-post', likesController.unlikePost);

router.post('/like-comment', likesController.likeComment);
router.post('/unlike-comment', likesController.unlikeComment);

module.exports = router;
