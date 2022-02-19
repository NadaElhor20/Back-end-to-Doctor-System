const mongoose = require('mongoose');
const doctorSchema = require('./doctorSchema');
const Doctor = mongoose.model('Doctor', doctorSchema,'doctorCollection');

module.exports = Doctor;