const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const selectedServiceSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    selected_sub_service_id: {
        type: Schema.Types.ObjectId,
        ref: "SubService",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// Create the model
const SelectedService = mongoose.model('SelectedService', selectedServiceSchema);

module.exports = SelectedService;
