const express = require('express');
const router = express.Router();
const budgetController = require('../controller/budget');

router.get('/last-month-income', budgetController.getLastMonthIncome);
router.post('/budget', budgetController.createBudget);
router.post('/budget/auto-allocate', budgetController.autoAllocateBudget);
router.get('/budget', budgetController.getBudget);
router.get('/budgets', budgetController.getAllBudgets);
router.put('/budget/collected', budgetController.updateCollectedAmount);
router.get('/budget-summary', budgetController.getBudgetSummary);
router.get('/expenditure-tracker', budgetController.getExpenditureTracker);

module.exports = router;

