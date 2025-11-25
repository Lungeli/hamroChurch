const express = require('express')

const router = express.Router()

const memberController = require('../controller/member')

router.post('/member', memberController.addNewMember)
router.get('/member',memberController.getAllMembers)
router.get('/male-count',memberController.countMale)
router.get('/female-count',memberController.countFemale)
router.get('/gender-percentage', memberController.getGenderPercentage)
router.get('/age-percentage', memberController.getAgePercentage)
router.get('/memberid/:id', memberController.findMemberById)

module.exports = router