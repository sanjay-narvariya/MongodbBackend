const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    from: {
        type: String,
        default: "",
        trim: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

slotSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Middleware to update slots for all vendors when a new slot is created
slotSchema.post('save', async function () {
    const Vendor = mongoose.model('Vendor');
    await Vendor.updateSlotsForVendors();
});

// Middleware to update vendors when a slot is deleted
slotSchema.pre('findOneAndDelete', async function (next) {
    const slot = await this.model.findOne(this.getQuery());
    console.log('slot find one and delete ', slot);
    const Vendor = mongoose.model('Vendor');
    await Vendor.updateMany(
        {},
        { $pull: { slots: { slot_id: slot._id } } }
    );
    next();
});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;