const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetHeadPercentageSchema = new Schema({
    headName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, { _id: false });

const budgetSettingsSchema = new Schema({
    budgetHeads: [budgetHeadPercentageSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Ensure only one active settings document exists
budgetSettingsSchema.statics.getActiveSettings = async function() {
    let settings = await this.findOne({ isActive: true });
    
    if (!settings) {
        // Create default settings if none exist
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
        
        settings = await this.create({
            budgetHeads: defaultHeads,
            isActive: true,
            updatedBy: 'System'
        });
    }
    
    return settings;
};

const BudgetSettings = mongoose.model('BudgetSettings', budgetSettingsSchema);

module.exports = BudgetSettings;



