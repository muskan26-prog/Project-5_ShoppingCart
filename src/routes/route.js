let express = require('express');
let userController = require('../controllers/userController')
let router = express.Router();

route.post('/write-file-aws', userController.createProfilePicture)
router.post('/register', userController.registerUser)
router.get('/user/:userId/profile', userController.getUser)
router.put('/user/:userId/profile', userController.updateUserDetailes)

module.exports = router;