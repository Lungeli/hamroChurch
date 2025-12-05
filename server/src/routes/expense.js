const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expense');

router.post('/expense', expenseController.addExpense);
router.get('/expenses', expenseController.getExpenses);
router.get('/expense/:id', expenseController.getExpenseById);
router.put('/expense/:id', expenseController.updateExpense);
router.delete('/expense/:id', expenseController.deleteExpense);
router.get('/expenses-by-head', expenseController.getExpensesByBudgetHead);
router.get('/expense-summary', expenseController.getExpenseSummary);

module.exports = router;



