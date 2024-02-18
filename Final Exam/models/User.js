const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        minLength: 10,
        required: [true, 'Email is required!']
    },
    password: {
        type: String,
        minLength: 4,
        required: true,
    },
    createdStones: [{
        type: mongoose.Types.ObjectId,
        ref: 'Stones'
    }],
    listOfLikes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Stones'
    }],
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

module.exports = User;