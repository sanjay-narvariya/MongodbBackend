const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Service Area schema
const serviceAreaSchema = new Schema({
    city: {
        type: String,
        trim: true,
        default: "",
    },
    state: {
        type: String,
        trim: true,
        default: "",
    },
    pincodes: [{
        type: String,
        trim: true,
        default: "",
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the 'updated_at' field
serviceAreaSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create the model
const ServiceArea = mongoose.model('ServiceArea', serviceAreaSchema);

module.exports = ServiceArea;
