const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subAdminPermissionSchema = new Schema({
    permission_name: {
        type: String,
        trim: true,
        default: ""
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

// Middleware to update the updated_at field before each save
subAdminPermissionSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const SubAdminPermission = mongoose.model('SubAdminPermission', subAdminPermissionSchema);

module.exports = SubAdminPermission;