const User = require('./userModel');
const Visit = require('../visits/visitModel')
const bcrypt = require('bcrypt');
const util = require('util');
const jwt = require('jsonwebtoken');

const asyncSign = util.promisify(jwt.sign);
const asyncVerify = util.promisify(jwt.verify);

const getUser = async (req, res, next) => {
    try {
        const users = await User.find();
    res.send(users)
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const userProfile = async (req, res, next) => {
    const {id}=req.params;
    try {
        const doctor = await User.findById(id);
        res.send(doctor)
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const postUser = async (req, res, next) => {
    const { yourName, mobileNumber, emailAddress, gender, BirthDate, password, admin } = req.body;
    try {
        const user = new User({ yourName, mobileNumber, emailAddress, gender, BirthDate, password, admin });
        if (req.file) {
			user.image = req.file.path;
		}
        const createdUser = await user.save();
        res.send(createdUser);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const editUserById = async (req, res, next) => {
    const { yourName, mobileNumber, emailAddress, gender, BirthDate, password ,admin} = req.body;
    const { id } = req.params;
    try {
        const updated = await User.findByIdAndUpdate(id, {
            yourName, mobileNumber, emailAddress, gender, BirthDate, password,admin
        }, { new: true })

        res.send(updated);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const deleteUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        res.send("Contact has Deleted Successfully");

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}

const login = async (req,res,next)=>{
    const { emailAddress, password } = req.body;
    try {
        const user  = await User.findOne({ emailAddress});
        if(!user)throw new Error('invalid EmailAddress or password');
        const {password: originalHashingPassword} = user;
        const result = await bcrypt.compare(password, originalHashingPassword);
        if(!result) throw new Error('invalid EmailAddress or password');
        const token = await asyncSign({
            id: user._id.toString()
        },process.env.SECRET_KEY
        );
        res.send({token});
    } catch (error) {
        next(error)
    }
}

const homeLog = async (req,res,next)=>{
      const { authorization } = req.headers;
    try {
        const payload = await asyncVerify(authorization, process.env.SECRET_KEY);
        const id = payload.id;
        const user = await User.findById(id)
        res.send(user)
    } catch (error) {
        error.message = "unauthorized";
        error.statusCode = 403;
        next(error);
    }
    next();
}

const getMyAppointments =  async (req, res, next) => {
    const {id} = req.params;
    try {
        const data = await Visit.find({userId:id}).populate ('doctorId',['doctorName','mobileNumber','fees','specification']);        
        res.send(data);

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}

const delOneAppointment =  async (req, res, next) => {
    const {id} = req.params;
    try {
        const data = await Visit.findByIdAndDelete(id);
        res.send("This Appointment deleted");

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}



module.exports = {
    getUser,
    userProfile,
    postUser,
    deleteUserById,
    editUserById,
    login,
    homeLog,
    getMyAppointments,
    delOneAppointment
}