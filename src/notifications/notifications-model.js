const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    booking_id: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
      vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
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

// Update the 'updated_at' field before each save
notificationsSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Notification = mongoose.model('Notification', notificationsSchema);

module.exports = Notification;