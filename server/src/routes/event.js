const express = require('express')

const router = express.Router()

const eventController = require('../controller/event')

router.get('/event', eventController.testEvent)


module.exports = router