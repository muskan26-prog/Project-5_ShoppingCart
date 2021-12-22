let express = require('express');
let userController = require('../controllers/userController')
let router = express.Router();

router.post('/register', userController.registerUser)

module.exports = router;