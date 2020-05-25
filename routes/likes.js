const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likes_controller');

router.post('/toggle', likesController.toggleLike);
router.get('/:id', likesController.getAllLikeablesLikedByUser);

module.exports = router;
