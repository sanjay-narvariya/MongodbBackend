const mongoose = require('mongoose');

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

const addressSchema = new mongoose.Schema({
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
  zip_code: {
    type: String,
    trim: true,
    default: "",
  },
  country: {
    type: String,
    trim: true,
    default: "",
  }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  full_name: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    trim: true,
    default: "",
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    default: "",
  },
  address: [addressSchema],
  profile_picture: {
    type: String,
    trim: true,
    default: "",
  },
  user_name: {
    type: String,
    unique: true,
    trim: true,
    default: "",
  },
  otp: {
    type: String,
    trim: true,
    default: "",
  },
  bank_details: bankSchema,
  upi: {
    type: String,
    trim: true,
    default: ""
  },
  is_membership: {
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
  },
  is_email_verified: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  gst: {
    type: String,
    default: ''
  }
});

// Pre-save middleware to update the updated_at field
customerSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Customer', customerSchema);