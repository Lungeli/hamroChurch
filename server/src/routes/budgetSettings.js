const express = require('express');
const router = express.Router();
const budgetSettingsController = require('../controller/budgetSettings');

router.get('/budget-settings', budgetSettingsController.getBudgetSettings);
router.put('/budget-settings', budgetSettingsController.updateBudgetSettings);
router.post('/budget-settings/reset', budgetSettingsController.resetBudgetSettings);

module.exports = router;



