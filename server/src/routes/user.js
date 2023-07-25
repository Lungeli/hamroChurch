
const express = require('express')

const router = express.Router()

const userController = require('../controller/user')

router.post('/register', userController.registerUser)
 


module.exports = router