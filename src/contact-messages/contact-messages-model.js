const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the Contact Messages
const contactMessageSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        default: "",
    },
    message: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        default: "",
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create the model from the schema
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
