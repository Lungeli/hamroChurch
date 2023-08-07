const express = require('express')

const router = express.Router()

const memberController = require('../controller/member')

router.post('/member', memberController.addNewMember)
router.get('/member',memberController.getAllProducts)

module.exports = router