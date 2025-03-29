const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");

// Define the schema for the Super Admins collection
const superAdminSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        default: "",
    },
    password: {
        type: String,
        trim: true,
        default: "",
    },
    otp: {
        type: String,
        trim: true,
        default: ""
    },
    is_super_admin: {
        type: Boolean,
        default: true,
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


// jwt token
superAdminSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// Middleware to update the `updated_at` field before each save
superAdminSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create the model from the schema
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;