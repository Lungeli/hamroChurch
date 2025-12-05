const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetHeadSchema = new Schema({
    headName: {
        type: String,
        required: true,
        trim: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    allocatedAmount: {
        type: Number,
        required: true,
        default: 0
    },
    carryOverAmount: {
        type: Number,
        default: 0
    },
    collectedAmount: {
        type: Number,
        default: 0
    },
    totalExpenses: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: 0
    }
}, { _id: false });

const budgetSchema = new Schema({
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    totalIncome: {
        type: Number,
        required: true,
        default: 0
    },
    budgetHeads: [budgetHeadSchema],
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    createdBy: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient querying by month and year
budgetSchema.index({ year: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;

