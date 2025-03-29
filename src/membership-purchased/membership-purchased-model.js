const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the MembershipPurchased collection
const membershipPurchasedSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer',
    },
    membership_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Membership',
    },
    start_date: {
        type: Date,
        default: Date.now,
    },
    end_date: {
        type: Date,
        default: null
    },
    membership_tenure: {
        type: String,
        enum: ['yearly', 'semi-yearly','quaterly'],
        default: "yearly",
    },
    membership_status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: "active",
    },
    amount: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

// Create the model from the schema
const MembershipPurchased = mongoose.model('MembershipPurchased', membershipPurchasedSchema);

module.exports = MembershipPurchased;