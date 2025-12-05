const Expense = require('../models/expense');
const Budget = require('../models/budget');

// Add new expense
const addExpense = async (req, res) => {
    try {
        const expenseData = {
            ...req.body,
            expenseDate: req.body.expenseDate ? new Date(req.body.expenseDate) : new Date()
        };

        // Extract month and year from expenseDate
        const expenseDate = new Date(expenseData.expenseDate);
        expenseData.month = expenseDate.getMonth() + 1;
        expenseData.year = expenseDate.getFullYear();

        const expense = await Expense.create(expenseData);

        // Update budget head expenses
        await updateBudgetExpenses(expenseData.month, expenseData.year, expenseData.budgetHead);

        res.json({
            msg: 'Expense added successfully',
            expense
        });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({
            msg: 'Failed to add expense',
            error: error.message
        });
    }
};

// Get all expenses
const getExpenses = async (req, res) => {
    try {
        const { month, year, budgetHead, fromDate, toDate } = req.query;
        let query = {};

        // Support date range filtering
        if (fromDate && toDate) {
            // Parse YYYY-MM-DD format - create dates in local timezone
            const fromParts = fromDate.split('-');
            const toParts = toDate.split('-');
            
            // Create start date at beginning of day
            const startDate = new Date(parseInt(fromParts[0]), parseInt(fromParts[1]) - 1, parseInt(fromParts[2]), 0, 0, 0, 0);
            // Create end date at end of day
            const endDate = new Date(parseInt(toParts[0]), parseInt(toParts[1]) - 1, parseInt(toParts[2]), 23, 59, 59, 999);
            
            console.log('Expense Query - fromDate:', fromDate, 'toDate:', toDate);
            console.log('Parsed startDate:', startDate.toISOString(), 'endDate:', endDate.toISOString());
            
            query.expenseDate = {
                $gte: startDate,
                $lte: endDate
            };
        } else if (month && year) {
            // Fallback to month/year for backward compatibility
            query.month = parseInt(month);
            query.year = parseInt(year);
        }

        if (budgetHead) {
            query.budgetHead = budgetHead;
        }

        const expenses = await Expense.find(query).sort({ expenseDate: -1 });
        res.json({ expenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id);
        
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ expense });
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If expenseDate is updated, update month and year
        if (updateData.expenseDate) {
            const expenseDate = new Date(updateData.expenseDate);
            updateData.month = expenseDate.getMonth() + 1;
            updateData.year = expenseDate.getFullYear();
        }

        const oldExpense = await Expense.findById(id);
        if (!oldExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        const expense = await Expense.findByIdAndUpdate(id, updateData, { new: true });

        // Update budget expenses for both old and new month/year if changed
        if (oldExpense.month && oldExpense.year) {
            await updateBudgetExpenses(oldExpense.month, oldExpense.year, oldExpense.budgetHead);
        }
        if (expense.month && expense.year) {
            await updateBudgetExpenses(expense.month, expense.year, expense.budgetHead);
        }

        res.json({
            msg: 'Expense updated successfully',
            expense
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({
            msg: 'Failed to update expense',
            error: error.message
        });
    }
};

// Delete expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id);
        
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        const { month, year, budgetHead } = expense;
        await Expense.findByIdAndDelete(id);

        // Update budget expenses
        await updateBudgetExpenses(month, year, budgetHead);

        res.json({ msg: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get expenses by budget head
const getExpensesByBudgetHead = async (req, res) => {
    try {
        const { month, year, budgetHead } = req.query;

        if (!month || !year || !budgetHead) {
            return res.status(400).json({ error: 'Month, year, and budget head are required' });
        }

        const expenses = await Expense.find({
            month: parseInt(month),
            year: parseInt(year),
            budgetHead
        }).sort({ expenseDate: -1 });

        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        res.json({
            budgetHead,
            month,
            year,
            expenses,
            totalExpenses,
            count: expenses.length
        });
    } catch (error) {
        console.error('Error fetching expenses by budget head:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get expense summary by month
const getExpenseSummary = async (req, res) => {
    try {
        // Check if mongoose is connected
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected. Connection state:', mongoose.connection.readyState);
            return res.status(503).json({ error: 'Database connection not available' });
        }

        const { month, year, fromDate, toDate } = req.query;
        let query = {};

        // Support date range filtering
        if (fromDate && toDate) {
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            query.expenseDate = {
                $gte: startDate,
                $lte: endDate
            };
        } else if (month && year) {
            // Fallback to month/year for backward compatibility
            query.month = parseInt(month);
            query.year = parseInt(year);
        } else {
            return res.status(400).json({ error: 'Either month/year or fromDate/toDate are required' });
        }

        const expenses = await Expense.find(query);

        // Group by budget head
        const summary = expenses.reduce((acc, expense) => {
            const head = expense.budgetHead;
            if (!acc[head]) {
                acc[head] = {
                    budgetHead: head,
                    totalAmount: 0,
                    count: 0,
                    expenses: []
                };
            }
            acc[head].totalAmount += expense.amount;
            acc[head].count += 1;
            acc[head].expenses.push(expense);
            return acc;
        }, {});

        res.json({
            month: month ? parseInt(month) : null,
            year: year ? parseInt(year) : null,
            fromDate: fromDate || null,
            toDate: toDate || null,
            summary: Object.values(summary),
            totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0)
        });
    } catch (error) {
        console.error('Error fetching expense summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper function to update budget expenses
const updateBudgetExpenses = async (month, year, budgetHead) => {
    try {
        const budget = await Budget.findOne({ month, year });
        if (!budget) {
            return; // Budget doesn't exist yet
        }

        const expenses = await Expense.find({
            month,
            year,
            budgetHead
        });

        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        const head = budget.budgetHeads.find(h => h.headName === budgetHead);
        if (head) {
            head.totalExpenses = totalExpenses;
            // Calculate remaining: (new allocation + carry-over) - expenses
            const totalAvailable = head.allocatedAmount + (head.carryOverAmount || 0);
            head.remainingAmount = totalAvailable - totalExpenses;
            await budget.save();
        }
    } catch (error) {
        console.error('Error updating budget expenses:', error);
    }
};

module.exports = {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpensesByBudgetHead,
    getExpenseSummary
};

