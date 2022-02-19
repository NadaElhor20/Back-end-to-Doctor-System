const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    approved:{
        type: Boolean,
        default:false
    },
    appointment: Date,
    doctorId: {
        type: mongoose.Schema.Types.ObjectId, ref:"Doctor",
        requird:"true"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref:"User",
        requird:"true"

    },
});



  module.exports = visitSchema;