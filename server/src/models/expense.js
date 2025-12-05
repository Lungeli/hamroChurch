const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
    expenseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    budgetHead: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Missions & Outreach',
            'Assemblies of God (AG) Giving',
            'Building & Maintenance',
            'Ministry & Worship',
            'Youth Ministry',
            'Other Ministries (Children, Women, Men, Prayer cells, etc.)',
            'Church Operations / Admin',
            'Emergency / Reserve / Monthly Savings'
        ]
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online', 'Other'],
        default: 'Cash'
    },
    receiptNumber: {
        type: String,
        trim: true
    },
    verifiedBy: {
        type: String,
        trim: true
    },
    recordedBy: {
        type: String,
        trim: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
expenseSchema.index({ year: 1, month: 1 });
expenseSchema.index({ budgetHead: 1 });
expenseSchema.index({ expenseDate: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;



