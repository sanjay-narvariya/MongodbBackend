const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
        default: "",
    },
    answer: {
        type: String,
        trim: true,
        default: "",
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update `updated_at` field on save
faqSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;