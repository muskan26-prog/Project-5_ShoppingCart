let express = require('express');
let userController = require('../controllers/userController')
// let awsController = require('../controllers/awsController')
let router = express.Router();
let midvarify = require('../middleware/verify')

// router.post('/write-file-aws', awsController.createProfilePicture)
router.post('/register', userController.registerUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile', midvarify.varifyUser, userController.getUser)
router.put('/user/:userId/profile',midvarify.varifyUser, userController.updateUserDetailes)

module.exports = router;