const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Membership schema
const membershipSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default:"",
  },
  description: {
    type: String,
    trim: true,
    default:"",
  },
  quaterly_price: {
    type: Number,
    default:0,
  },
  quaterly_discounted_price: {
    type: Number,
    default:0,
  },
  yearly_price: {
    type: Number,
    default:0,
  },
  yearly_discounted_price: {
    type: Number,
    default:0,
  },
  semi_yearly_price: {
    type: Number,
    default:0,
  },
  semi_yearly_discounted_price: {
    type: Number,
    default:0,
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

// Pre-save middleware to update the 'updated_at' field
membershipSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create the model
const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
