const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    completeName: String,
    userName: String,
    dateOfBirth: Date,
    email: String,
    password: String,
});

module.exports = mongoose.model('User', UserSchema);