const express = require('Express');
const router = express.Router();
const comments_controller = require('../controllers/comments_controller');

router.post('/post-comment/', comments_controller.postComment);

module.exports = router;