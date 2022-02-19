const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    yourName: {
        type: String,
        required: true,
    },
    mobileNumber:{
        type: String,
        required: true,
        match:[/^01[0-2,5]{1}[0-9]{8}$/,'Please Fill a Valid Phone Number'],
    },
    emailAddress: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please Fill a Valid Email Address']
    },
    gender:{
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    BirthDate: Date,
    password: {
        type: String,
        required: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'Please Fill with a Correct Pattern  Minimum eight characters, at least one uppercase letter, one lowercase letter and one number']
        
    },
    admin:{
        type:Boolean,
        default:false
    },
    image:{
        type:String
    }
});




  module.exports = userSchema;