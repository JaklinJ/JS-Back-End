const mongoose = require('mongoose');

const stonesSchema = new mongoose.Schema({
    name: {
        type: String, 
        minLength: 2,
        lowercase: true,
        required: true,
    },
    category: {
        type: String, 
        minLength: 3,
        required: true,
    },
    color: {
        type: String, 
        minLength: 2,
        required: true,
    },
    image: {
        type: String, 
        match: /^https?:\/\//,
        required: true,
    },
    location: {
        type: String,
        minLength: 5,
        maxLength: 15, 
        required: true,
    },
    formula: {
        type: String, 
        minLength: 3,
        maxLength: 30,
        required: true,
    },
    description: {
        type: String, 
        minLength: 10,
        required: true,
    },
    likedList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Date,
});

stonesSchema.pre('save', function() {
    if(!this.createdAt) {
        this.createdAt = Date.now();
    }
});

const Stones = mongoose.model('Stones', stonesSchema);

module.exports = Stones;