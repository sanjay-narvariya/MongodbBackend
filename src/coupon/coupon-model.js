const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Coupons collection
const CouponSchema = new Schema({
    coupon_code: {
        type: String,
        unique: true,
        trim: true
    },
    discount_value: {
        type: Number,
        default: 0,
    },
    expiry_date: {
        type: Date,
    },
    is_active: {
        type: Boolean,
        default: true
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
CouponSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

CouponSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updated_at: Date.now() });
    next();
});

// Create the model from the schema and export it
const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
