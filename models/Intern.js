const mongoose = require('mongoose');

// Define the schema for an intern
const internSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  role: {
    type: String,
    default: 'Intern'
  },
  password: {
    type: String,
    required: true
  }
});

// Create and export the Intern model
module.exports = mongoose.model('Intern', internSchema);
