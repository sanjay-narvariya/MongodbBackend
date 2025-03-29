const mongoose = require('mongoose');
const { Schema } = mongoose;


const bankSchema = new mongoose.Schema({
    bank_name: {
        type: String,
        trim: true,
        default: ""
    },
    account_number: {
        type: String,
        trim: true,
        default: ""
    },
    ifsc: {
        type: String,
        trim: true,
        default: ""
    },
    account_holder_name: {
        type: String,
        trim: true,
        default: ""
    },
    branch_name: {
        type: String,
        trim: true,
        default: ""
    }
}, { _id: false });

// Define the schema for the Refunds collection
const refundSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    booking_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Booking'
    },
    org_amount: {
        type: Number,
        default: 0,
    },
    bank_details: bankSchema,
    upi: {
        type: String,
        default: "",
    },
    refund_amount: {
        type: Number,
        default: 0,
    },
    reason: {
        type: String,
        default: "",
    },
    refund_status: {
        type: String,
        default: 'pending',
    },
    cancel_type: {
        type: String,
        enum: ['requested', 'normal', 'unserviced'],
        default: 'normal',
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Create the model from the schema
const Refund = mongoose.model('Refund', refundSchema);

module.exports = Refund;
