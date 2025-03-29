const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true
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

// Middleware to update the updated_at field on save
newsletterSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;