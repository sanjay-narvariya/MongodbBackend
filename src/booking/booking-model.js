const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        default: "",
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        default: "",
    },
    street: {
        type: String,
        trim: true,
        default: "",
    },
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
    // latitude: {
    //     type: Number,
    //     default: 0
    // },
    // longitude: {
    //     type: Number,
    //     default: 0
    // },
    zip_code: {
        type: String,
        trim: true,
        default: "",
    },
}, { _id: false });

const vendorDetailSchema = new Schema({
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        default: null,
    },
    email_sent: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const bookingSchema = new Schema({
    booking_id: {
        type: String,
        unique: true,
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    service_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Service',
    }],
    sub_service_id: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'SubService',
        },
        amount: {
            type: Number,
            default: 0
        }
    }],
    vendors: [vendorDetailSchema],
    booking_date: {
        type: Date,
        default: Date.now,
    },
    service_date: {
        type: String,
        trim: true,
        default: "",
    },
    service_time: {
        type: String,
        trim: true,
        default: "",
    },
    booking_status: {
        type: String,
        // enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: "scheduled",
    },
    total_amount: {
        type: Number,
        default: 0,
    },
    transaction_id: {
        type: String,
        trim: true,
        default: "",
    },
    remaining_amount: {
        type: String,
        trim: true,
        default: "",
    },
    paid_amount: {
        type: String,
        trim: true,
        default: "",
    },
    refund_amount: {
        type: String,
        trim: true,
        default: "",
    },
    discount: {
        type: String,
        trim: true,
        default: "",
    },
    billing_info: billingSchema,
    on_site: {
        type: Boolean,
        default: false
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
bookingSchema.pre('save', function (next) {
    this.updated_at = Date.now();

    this.vendors.forEach(vendor => {
        if (vendor.vendor_id === "") {
            vendor.vendor_id = null;
        }
    });

    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
