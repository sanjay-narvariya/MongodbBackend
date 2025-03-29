const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    booking_id: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false
    },
    // sub_service_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'SubService',
    //     required: false
    // },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: false,
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    rating: {
        type: Number,
        default: 0,
    },
    review_text: {
        type: String,
        trim: true,
        default: "",
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

// Middleware to update the 'updated_at' field on document update
reviewSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;