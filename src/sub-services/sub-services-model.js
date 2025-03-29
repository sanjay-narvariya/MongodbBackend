const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubServiceSchema = new Schema({
    sub_service_name: {
        type: String,
        trim: true,
        default: "",
    },
    parent_service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    sub_service_image: {
        type: String,
        trim: false,
        default: "",
    },
    description: {
        type: String,
        trim: false,
        default: "",
    },
    duration: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    discounted_price: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

// Middleware to update the 'updated_at' field on update
SubServiceSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});


SubServiceSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await mongoose.model('Service').updateOne(
            { _id: doc.parent_service_id },
            { $pull: { sub_services: doc._id } }
        );
    }
});

const SubService = mongoose.model('SubService', SubServiceSchema);

module.exports = SubService;