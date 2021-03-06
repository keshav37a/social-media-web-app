const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
console.log('router loaded');

//for any further use router.use('.{route}', require('./route.js file'))
//In route.js further mapping has to be done router.get('/{text}', controller property)
// router.use(express.urlencoded());

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comment'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friends'));

//for api
router.use('/api', require('./api'));

module.exports = router;