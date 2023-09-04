const express = require('express')

const router = express.Router()

const eventController = require('../controller/event')

router.get('/event', eventController.getEvent)
router.post('/event', eventController.addNewEvent)


module.exports = router