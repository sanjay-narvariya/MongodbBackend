const mongoose = require('mongoose');
const { Schema } = mongoose;

const completedServiceSchema = new Schema({
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service"
    },
    sub_services: [{
        type: Schema.Types.ObjectId,
        ref: "SubService"
    }],
    total_amount: {
        type: Number,
        default: 0
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: "Vendor"
    },
}, { _id: false });

const inCompletedServiceSchema = new Schema({
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service"
    },
    sub_services: [{
        type: Schema.Types.ObjectId,
        ref: "SubService"
    }],
    total_amount: {
        type: Number,
        default: 0
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: "Vendor"
    }
}, { _id: false });

// Define the schema for the Contact Messages
const bookingCompletedSchema = new Schema({
    booking_id: {
        type: Schema.Types.ObjectId,
        ref: "Booking"
    },
    photos: [
        {
            type: "String",
            trim: true,
            default: ""
        }
    ],
    videos: [
        {
            type: "String",
            trim: true,
            default: ""
        }
    ],
    completed_services: [completedServiceSchema],
    incompleted_services: [inCompletedServiceSchema],
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create the model from the schema
const BookingCompleted = mongoose.model('BookingCompleted', bookingCompletedSchema);

module.exports = BookingCompleted;