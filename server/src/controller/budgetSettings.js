const BudgetSettings = require('../models/budgetSettings');

// Get current budget head percentages
const getBudgetSettings = async (req, res) => {
    try {
        const settings = await BudgetSettings.getActiveSettings();
        res.json({ settings });
    } catch (error) {
        console.error('Error fetching budget settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update budget head percentages
const updateBudgetSettings = async (req, res) => {
    try {
        const { budgetHeads, updatedBy } = req.body;

        // Validate that percentages sum to 100
        const totalPercentage = budgetHeads.reduce((sum, head) => sum + head.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            return res.status(400).json({
                error: 'Budget head percentages must sum to 100%',
                currentTotal: totalPercentage
            });
        }

        // Validate all percentages are between 0 and 100
        const invalidHeads = budgetHeads.filter(head => head.percentage < 0 || head.percentage > 100);
        if (invalidHeads.length > 0) {
            return res.status(400).json({
                error: 'All percentages must be between 0 and 100',
                invalidHeads
            });
        }

        // Deactivate old settings
        await BudgetSettings.updateMany({ isActive: true }, { isActive: false });

        // Create new active settings
        const settings = await BudgetSettings.create({
            budgetHeads,
            isActive: true,
            updatedBy: updatedBy || 'Admin'
        });

        res.json({
            msg: 'Budget settings updated successfully',
            settings
        });
    } catch (error) {
        console.error('Error updating budget settings:', error);
        res.status(500).json({
            error: 'Failed to update budget settings',
            message: error.message
        });
    }
};

// Reset to default settings
const resetBudgetSettings = async (req, res) => {
    try {
        const defaultHeads = [
            { headName: 'Missions & Outreach', percentage: 25 },
            { headName: 'Assemblies of God (AG) Giving', percentage: 20 },
            { headName: 'Building & Maintenance', percentage: 18 },
            { headName: 'Ministry & Worship', percentage: 12 },
            { headName: 'Youth Ministry', percentage: 8 },
            { headName: 'Other Ministries (Children, Women, Men, Prayer cells, etc.)', percentage: 7 },
            { headName: 'Church Operations / Admin', percentage: 5 },
            { headName: 'Emergency / Reserve / Monthly Savings', percentage: 5 }
        ];

        // Deactivate old settings
        await BudgetSettings.updateMany({ isActive: true }, { isActive: false });

        // Create new active settings with defaults
        const settings = await BudgetSettings.create({
            budgetHeads: defaultHeads,
            isActive: true,
            updatedBy: req.body.updatedBy || 'Admin'
        });

        res.json({
            msg: 'Budget settings reset to default',
            settings
        });
    } catch (error) {
        console.error('Error resetting budget settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getBudgetSettings,
    updateBudgetSettings,
    resetBudgetSettings
};



