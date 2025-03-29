const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the Featured Banners collection
const featuredBannerSchema = new Schema({
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

// Middleware to update the `updated_at` field before each save
featuredBannerSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create the model from the schema
const FeaturedBanner = mongoose.model('FeaturedBanner', featuredBannerSchema);

module.exports = FeaturedBanner;
