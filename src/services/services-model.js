const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the service schema
const serviceSchema = new Schema({
    service_name: {
        type: String,
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    service_image: {
        type: String,
        trim: true,
        default: "",
    },
    sub_services: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SubService'
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the updated_at field
serviceSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create the model
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;