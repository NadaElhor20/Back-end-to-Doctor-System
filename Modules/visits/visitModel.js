const mongoose = require('mongoose');
const visitSchema = require('./visitSchema');
const Visit = mongoose.model('Visit', visitSchema,'visitsCollection');

module.exports = Visit;