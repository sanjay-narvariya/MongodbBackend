const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorPaymentsSchema = new Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    payment_amount: {
        type: String,
        required: false
    },
    payment_status: {
        type: String,
        enum: ['scheduled', 'success', 'failure'],
        required: false,
        default: 'scheduled'
    },
    month: {
        type: String,
        required: false
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
vendorPaymentsSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const VendorPayments = mongoose.model('VendorPayments', vendorPaymentsSchema);

module.exports = VendorPayments;