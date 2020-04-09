const express = require('express');
const posts_api_controller = require('../../../controllers/api/v1/posts_api');
const router = express.Router();

router.get('/', posts_api_controller.index);
router.delete('/:id', posts_api_controller.deletePost);

module.exports = router;