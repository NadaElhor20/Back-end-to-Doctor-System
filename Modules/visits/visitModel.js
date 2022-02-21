const mongoose = require('mongoose');
const visitSchema = require('./visitSchema');
const Doctor = mongoose.model('Visit', visitSchema,'visitsCollection');

module.exports = Doctor;