const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Service Requests collection
const ServiceRequestSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
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

// Middleware to update the `updated_at` field on document update
ServiceRequestSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

ServiceRequestSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updated_at: Date.now() });
    next();
});

// Create the model from the schema and export it
const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

module.exports = ServiceRequest;
