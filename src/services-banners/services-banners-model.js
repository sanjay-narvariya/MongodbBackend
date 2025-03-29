const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const serviceBannerSchema = new Schema({
    banner: {
        type: String,
        trim: true,
        default: "",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the updated_at field before saving
serviceBannerSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create the model
const ServiceBanner = mongoose.model('ServiceBanner', serviceBannerSchema);

module.exports = ServiceBanner;