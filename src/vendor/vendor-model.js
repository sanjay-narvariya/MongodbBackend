const mongoose = require('mongoose');
const Slot = require('../slot/slot-model');
const { Schema } = mongoose;

// Define the address schema
const addressSchema = new Schema({
    street: {
        type: String,
        trim: true,
        default: ""
    },
    city: {
        type: String,
        trim: true,
        default: ""
    },
    state: {
        type: String,
        trim: true,
        default: ""
    },
    zip_code: {
        type: String,
        trim: true,
        default: ""
    },
    country: {
        type: String,
        trim: true,
        default: ""
    },
    // latitude: {
    //     type: Number,
    //     default: 0
    // },
    // longitude: {
    //     type: Number,
    //     default: 0
    // },
}, { _id: false });


const bankSchema = new Schema({
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

const slotSchema = new Schema({
    slot_id: {
        type: Schema.Types.ObjectId,
        ref: 'Slot',
    },
    slot_name: {
        type: String,
        trim: true,
        default: ""
    },
    is_available: {
        type: Boolean,
        default: true
    }
}, { _id: false });



// Define the vendor schema
const vendorSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    slots: [slotSchema],
    address: [addressSchema],
    total_earnings: [{
        earnings: {
            type: Number,
            default: 0
        },
        date: {
            type: Date,
            default: Date.now
        }
    }, { _id: false }],
    profile_picture: {
        type: String,
        trim: true,
        default: ""
    },
    profession_id: {
        type: Schema.Types.ObjectId,
        ref: 'Profession',
    },
    commission: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    at_work: {
        type: Boolean,
        default: true
    },
    aadhar: {
        type: String,
        default: "",
        trim: true
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        trim: true,
        default: "",
    },
    device_type: {
        type: String,
        trim: true,
        default: "",
    },
    device_token: {
        type: String,
        trim: true,
        default: "",
    },
    bank_details: bankSchema,
    serviceable_zipcodes: [{
        type: String,
        trim: true,
        default: ""
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the 'updated_at' field on document update
vendorSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});


vendorSchema.statics.updateSlotsForVendors = async function () {
    const slots = await Slot.find({});
    const slotData = slots.map(slot => ({
        slot_id: slot._id,
        slot_name: slot.from
    }));

    await this.updateMany({}, { $set: { slots: slotData } });
};


const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;