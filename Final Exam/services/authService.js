const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');
const { secret } = require('../config')
const User = require('../models/User');

exports.register = async (userData) => {
    if (userData.password !== userData.rePassword) {
    throw new Error('Passwords do not match!');
    };

    const user = await User.findOne({ email: userData.email });

    if (user) {
        throw new Error('User already exists');
    };

    const createdUser = await User.create(userData);

    const token = await generateToken(createdUser);
    return token;
};

exports.login = async ({ email, password }) => {
    //get user from DB
    const user = await User.findOne({ email })
    //check password
    if (!user) {
        throw new Error('Email or password is invalid')
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Email or password is invalid')
    }

    const token = await generateToken(user)

    return token;
};

function generateToken(user) {
    const payload = {
        username: user.username,
        email: user.email,
        _id: user._id,
    }
    return jwt.sign(payload, secret, { expiresIn: '2h' });

};