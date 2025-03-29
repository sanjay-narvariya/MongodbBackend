const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const professionSchema = new Schema({
    profession_name: {
        type: String,
        required: true
    },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
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

// Update the 'updated_at' field before each save
professionSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Profession = mongoose.model('Profession', professionSchema);

module.exports = Profession;
