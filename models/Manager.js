// models/Manager.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Manager schema
const managerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactInfo: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    role: {
        type: String,
        default: 'Manager',  // Default role is 'Manager'
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash password before saving
managerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;
