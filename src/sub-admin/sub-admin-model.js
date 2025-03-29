const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subAdminSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },
    city: {
        type: String,
        trim: true,
        default: "",
    },
    password: {
        type: String,
        trim: true,
        default: ""
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'SubAdminPermission'
    }],
    is_sub_admin: {
        type: Boolean,
        default: true
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

// Middleware to update the `updated_at` field before saving
subAdminSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const SubAdmin = mongoose.model('SubAdmin', subAdminSchema);

module.exports = SubAdmin;
