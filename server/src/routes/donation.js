const express = require('express')

const router = express.Router()

const donationController = require('../controller/donation')

router.post('/donation', donationController.addNewDonation)
router.get('/donation-amount', donationController.getTotalDonationAmount)
router.get('/donations', donationController.getDonations)
router.get('/donation-current-month', donationController.getCurrentMonthDonations)
router.get('/monthly-donations', donationController.getMonthlyDonations)
router.get('/generate-donation-report', donationController.generateReport)
// router.get('/member',memberController.getAllMembers)

module.exports = router