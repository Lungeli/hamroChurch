const Budget = require('../models/budget');
const Donations = require('../models/donation');
const Expense = require('../models/expense');
const BudgetSettings = require('../models/budgetSettings');

// Get budget percentages from settings
const getBudgetPercentages = async () => {
    try {
        const settings = await BudgetSettings.getActiveSettings();
        const percentages = {};
        settings.budgetHeads.forEach(head => {
            percentages[head.headName] = head.percentage;
        });
        return percentages;
    } catch (error) {
        console.error('Error getting budget percentages:', error);
        // Return default percentages as fallback
        return {
            'Missions & Outreach': 25,
            'Assemblies of God (AG) Giving': 20,
            'Building & Maintenance': 18,
            'Ministry & Worship': 12,
            'Youth Ministry': 8,
            'Other Ministries (Children, Women, Men, Prayer cells, etc.)': 7,
            'Church Operations / Admin': 5,
            'Emergency / Reserve / Monthly Savings': 5
        };
    }
};

// Get last month's total income (relative to selected month or current month)
const getLastMonthIncome = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        let targetDate;
        if (month && year) {
            // Get previous month relative to the selected month
            targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            targetDate.setMonth(targetDate.getMonth() - 1);
        } else {
            // Default to last month from current date
            const now = new Date();
            targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        }
        
        const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

        const aggregationPipeline = [
            {
                $match: {
                    donationDate: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$donationAmount' }
                }
            }
        ];

        const result = await Donations.aggregate(aggregationPipeline);
        const totalIncome = result[0]?.totalIncome || 0;

        res.json({
            totalIncome,
            month: targetDate.getMonth() + 1,
            year: targetDate.getFullYear(),
            monthName: targetDate.toLocaleString('default', { month: 'long' })
        });
    } catch (error) {
        console.error('Error fetching last month income:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get previous month's remaining balances (carry-over)
const getPreviousMonthCarryOver = async (month, year) => {
    try {
        let prevMonth = month - 1;
        let prevYear = year;
        
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
        }

        const previousBudget = await Budget.findOne({ month: prevMonth, year: prevYear });
        const BUDGET_PERCENTAGES = await getBudgetPercentages();
        
        if (!previousBudget) {
            // No previous budget, return zero carry-over for all heads
            return Object.keys(BUDGET_PERCENTAGES).reduce((acc, headName) => {
                acc[headName] = 0;
                return acc;
            }, {});
        }

        // Get expenses for previous month to calculate actual remaining
        const prevExpenses = await Expense.find({
            month: prevMonth,
            year: prevYear
        });

        // Calculate carry-over (remaining balance) for each head
        const carryOver = {};
        previousBudget.budgetHeads.forEach(head => {
            const headExpenses = prevExpenses
                .filter(exp => exp.budgetHead === head.headName)
                .reduce((sum, exp) => sum + exp.amount, 0);
            
            const remaining = (head.allocatedAmount + (head.carryOverAmount || 0)) - headExpenses;
            carryOver[head.headName] = Math.max(0, remaining); // Only carry forward positive amounts
        });

        return carryOver;
    } catch (error) {
        console.error('Error getting previous month carry-over:', error);
        const BUDGET_PERCENTAGES = await getBudgetPercentages();
        return Object.keys(BUDGET_PERCENTAGES).reduce((acc, headName) => {
            acc[headName] = 0;
            return acc;
        }, {});
    }
};

// Create budget allocation for a month
const createBudget = async (req, res) => {
    try {
        const { month, year, totalIncome, notes, createdBy } = req.body;

        // Check if budget already exists for this month/year
        const existingBudget = await Budget.findOne({ month, year });
        if (existingBudget) {
            return res.status(400).json({
                msg: 'Budget already exists for this month',
                budget: existingBudget
            });
        }

        // Get carry-over amounts from previous month
        const carryOverAmounts = await getPreviousMonthCarryOver(month, year);
        
        // Get budget percentages from settings
        const BUDGET_PERCENTAGES = await getBudgetPercentages();

        // Create budget heads with allocations (new allocation + carry-over)
        const budgetHeads = Object.keys(BUDGET_PERCENTAGES).map(headName => {
            const percentage = BUDGET_PERCENTAGES[headName];
            const newAllocation = Math.round((totalIncome * percentage) / 100);
            const carryOver = carryOverAmounts[headName] || 0;
            const totalAllocated = newAllocation + carryOver;
            
            return {
                headName,
                percentage,
                allocatedAmount: newAllocation,
                carryOverAmount: carryOver,
                collectedAmount: 0,
                totalExpenses: 0,
                remainingAmount: totalAllocated
            };
        });

        const budget = await Budget.create({
            month,
            year,
            totalIncome,
            budgetHeads,
            notes,
            createdBy,
            status: 'active'
        });

        res.json({
            msg: 'Budget allocated successfully with carry-over',
            budget
        });
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({
            msg: 'Failed to create budget',
            error: error.message
        });
    }
};

// Get budget by month and year
const getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        const budget = await Budget.findOne({ month: parseInt(month), year: parseInt(year) });
        
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found for this month' });
        }

        // Calculate expenses for each budget head
        const expenses = await Expense.find({
            month: parseInt(month),
            year: parseInt(year)
        });

        // Update budget heads with actual expenses
        const updatedBudgetHeads = budget.budgetHeads.map(head => {
            const headExpenses = expenses
                .filter(exp => exp.budgetHead === head.headName)
                .reduce((sum, exp) => sum + exp.amount, 0);
            
            const totalAvailable = head.allocatedAmount + (head.carryOverAmount || 0);
            const remaining = totalAvailable - headExpenses;
            
            return {
                ...head.toObject(),
                totalExpenses: headExpenses,
                remainingAmount: remaining
            };
        });

        budget.budgetHeads = updatedBudgetHeads;
        await budget.save();

        res.json({ budget });
    } catch (error) {
        console.error('Error fetching budget:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all budgets
const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find().sort({ year: -1, month: -1 });
        res.json({ budgets });
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update budget collected amount (when income is received)
const updateCollectedAmount = async (req, res) => {
    try {
        const { month, year, budgetHead, amount } = req.body;

        const budget = await Budget.findOne({ month, year });
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        const head = budget.budgetHeads.find(h => h.headName === budgetHead);
        if (!head) {
            return res.status(404).json({ error: 'Budget head not found' });
        }

        head.collectedAmount = (head.collectedAmount || 0) + amount;
        await budget.save();

        res.json({
            msg: 'Collected amount updated successfully',
            budget
        });
    } catch (error) {
        console.error('Error updating collected amount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get budget summary (all heads with expenses)
const getBudgetSummary = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        const budget = await Budget.findOne({ month: parseInt(month), year: parseInt(year) });
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        // Get all expenses for this month
        const expenses = await Expense.find({
            month: parseInt(month),
            year: parseInt(year)
        });

        // Calculate summary for each head
        const summary = budget.budgetHeads.map(head => {
            const headExpenses = expenses
                .filter(exp => exp.budgetHead === head.headName)
                .reduce((sum, exp) => sum + exp.amount, 0);

            const carryOver = head.carryOverAmount || 0;
            const totalAvailable = head.allocatedAmount + carryOver;
            const remaining = totalAvailable - headExpenses;

            return {
                headName: head.headName,
                percentage: head.percentage,
                allocatedAmount: head.allocatedAmount,
                carryOverAmount: carryOver,
                totalAvailable: totalAvailable,
                collectedAmount: head.collectedAmount || 0,
                totalExpenses: headExpenses,
                remainingAmount: remaining,
                utilizationPercentage: totalAvailable > 0 
                    ? Math.round((headExpenses / totalAvailable) * 100) 
                    : 0
            };
        });

        const totalAllocated = budget.budgetHeads.reduce((sum, h) => sum + h.allocatedAmount, 0);
        const totalCarryOver = budget.budgetHeads.reduce((sum, h) => sum + (h.carryOverAmount || 0), 0);
        const totalAvailable = totalAllocated + totalCarryOver;

        res.json({
            month: budget.month,
            year: budget.year,
            totalIncome: budget.totalIncome,
            totalAllocated,
            totalCarryOver,
            totalAvailable,
            totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
            summary
        });
    } catch (error) {
        console.error('Error fetching budget summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Automatically allocate budget for current month based on last month's income
const autoAllocateBudget = async (req, res) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Check if budget already exists for current month
        const existingBudget = await Budget.findOne({ month: currentMonth, year: currentYear });
        if (existingBudget) {
            return res.status(400).json({
                msg: 'Budget already exists for this month',
                budget: existingBudget
            });
        }

        // Get last month's income
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999);

        const aggregationPipeline = [
            {
                $match: {
                    donationDate: {
                        $gte: startOfLastMonth,
                        $lte: endOfLastMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$donationAmount' }
                }
            }
        ];

        const result = await Donations.aggregate(aggregationPipeline);
        const totalIncome = result[0]?.totalIncome || 0;

        if (totalIncome === 0) {
            return res.status(400).json({
                msg: 'No income found for last month. Cannot allocate budget.',
                totalIncome: 0
            });
        }

        // Get carry-over amounts from previous month
        const carryOverAmounts = await getPreviousMonthCarryOver(currentMonth, currentYear);
        
        // Get budget percentages from settings
        const BUDGET_PERCENTAGES = await getBudgetPercentages();

        // Create budget heads with allocations
        const budgetHeads = Object.keys(BUDGET_PERCENTAGES).map(headName => {
            const percentage = BUDGET_PERCENTAGES[headName];
            const newAllocation = Math.round((totalIncome * percentage) / 100);
            const carryOver = carryOverAmounts[headName] || 0;
            const totalAllocated = newAllocation + carryOver;
            
            return {
                headName,
                percentage,
                allocatedAmount: newAllocation,
                carryOverAmount: carryOver,
                collectedAmount: 0,
                totalExpenses: 0,
                remainingAmount: totalAllocated
            };
        });

        const budget = await Budget.create({
            month: currentMonth,
            year: currentYear,
            totalIncome,
            budgetHeads,
            notes: 'Automatically allocated based on last month\'s income',
            createdBy: 'System',
            status: 'active'
        });

        res.json({
            msg: 'Budget automatically allocated successfully',
            budget
        });
    } catch (error) {
        console.error('Error auto-allocating budget:', error);
        res.status(500).json({
            msg: 'Failed to auto-allocate budget',
            error: error.message
        });
    }
};

// Get expenditure tracker data (expenses over time)
const getExpenditureTracker = async (req, res) => {
    try {
        const { months = 6 } = req.query; // Default to last 6 months
        const now = new Date();
        const data = [];

        for (let i = parseInt(months) - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const expenses = await Expense.find({ month, year });
            const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

            // Get budget for this month
            const budget = await Budget.findOne({ month, year });
            const totalBudget = budget 
                ? budget.budgetHeads.reduce((sum, h) => sum + h.allocatedAmount + (h.carryOverAmount || 0), 0)
                : 0;

            data.push({
                month: date.toLocaleString('default', { month: 'short' }),
                monthNum: month,
                year,
                totalExpenses,
                totalBudget,
                expensesByHead: expenses.reduce((acc, exp) => {
                    acc[exp.budgetHead] = (acc[exp.budgetHead] || 0) + exp.amount;
                    return acc;
                }, {})
            });
        }

        res.json({ data });
    } catch (error) {
        console.error('Error fetching expenditure tracker:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getLastMonthIncome,
    createBudget,
    getBudget,
    getAllBudgets,
    updateCollectedAmount,
    getBudgetSummary,
    autoAllocateBudget,
    getExpenditureTracker
};

