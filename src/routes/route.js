let express = require('express');
let userController = require('../controllers/userController')
let awsController = require('../controllers/awsController')
let router = express.Router();
// let authMiddleWare = require('../middleware/verify')

// router.post('/write-file-aws', awsController.createProfilePicture)
router.post('/register', userController.registerUser)
router.get('/user/:userId/profile', userController.getUser)
router.put('/user/:userId/profile', userController.updateUserDetailes)
router.post('/login', userController.login)

module.exports = router;