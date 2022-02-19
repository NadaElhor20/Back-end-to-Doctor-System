const Doctor = require('./doctorModel');
const User = require ('../Users/userModel')
const Visit = require('../visits/visitModel')
const bcrypt = require('bcrypt');
const util = require('util');
const jwt = require('jsonwebtoken');

const asyncSign = util.promisify(jwt.sign);
const asyncVerify = util.promisify(jwt.verify);

const getDoctor = async (req, res, next) => {
    try {
        const {specification,gender,pageNo,limit,skip} = req.query;
        const page = pageNo || 1;
        const limitValue = limit ||1;
        const skipValue = skip || (page - 1) * limitValue;
        const doctor = await Doctor.find({$or:[{specification},{gender}]}).limit(limitValue).skip(skipValue);
    if (doctor.length) {
        res.send(doctor);
    } else {
        const allDoctor = await Doctor.find().limit(limitValue).skip(skipValue);
        res.send(allDoctor);
    }
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const doctorProfile = async (req, res, next) => {
    const {id}=req.params;
    try {
        const doctor = await Doctor.findById(id);
        res.send(doctor)
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const postDoctor = async (req, res, next) => {
    const { doctorName,mobileNumber,emailAddress,gender,password,fees,specification,description } = req.body;
    try {
        const doctor = new Doctor({doctorName,mobileNumber,emailAddress,gender,password,fees,specification,description});
         if (req.file) {
			doctor.image = req.file.path;
		}
        const createdDoctor = await doctor.save();
        res.send(createdDoctor);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const editDoctorById = async (req, res, next) => {
    const { doctorName,mobileNumber,emailAddress,gender,password,fees,specification,description} = req.body;
    const { id } = req.params;
    try {
        const updated = await Doctor.findByIdAndUpdate(id, {
         doctorName,mobileNumber,emailAddress,gender,password,fees,specification,description}, { new: true })

        res.send(updated);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const deleteDoctorById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const comment = await Doctor.findByIdAndDelete(id);
        res.send("Doctor has Deleted Successfully");

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}

const doctorLogin = async (req,res,next)=>{
    const { emailAddress, password } = req.body;
    try {
        const doctor  = await Doctor.findOne({ emailAddress});
        if(!doctor)throw new Error('invalid EmailAddress or password');
        const {password: originalHashingPassword} = doctor;
        const result = await bcrypt.compare(password, originalHashingPassword);
        if(!result) throw new Error('invalid EmailAddress or password');
        const token = await asyncSign({
            id:doctor._id.toString()
        },process.env.SECRET_KEY
        );
        res.send({token});
    } catch (error) {
        next(error)
    }
}

const doctorHome = async (req,res,next)=>{
      const { authorization } = req.headers;
    try {
        const payload = await asyncVerify(authorization, process.env.SECRET_KEY);
        const id = payload.id;
        const doctor = await Doctor.findById(id)
        res.send(doctor)
    } catch (error) {
        error.message = "unauthorized";
        error.statusCode = 403;
        next(error);
    }
    next();
}

const booking =  async (req, res, next) => {
    const {id}=req.params;
    const { appointment , userEmail } = req.body;
    try {
        const user = await User.findOne({emailAddress:userEmail})
        const userId = user._id.toString();
        const visit = new Visit({ appointment ,  userId , doctorId:id});
        const createdBook = await visit.save();
        res.send(createdBook);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const getBooks =  async (req, res, next) => {
    const {id} = req.params;
    try {
        const data = await Visit.find({doctorId:id}).populate ('userId',['yourName','gender','BirthDate','mobileNumber','emailAddress']);        
        res.send(data);

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}

const getOneBook =  async (req, res, next) => {
    const {id} = req.params;
    try {
        const data = await Visit.findById(id).populate ('userId',['yourName','gender','BirthDate','mobileNumber','emailAddress']);        
        res.send(data);

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}

const aproveBook =  async (req, res, next) => {
    const {id} = req.params;
    const {approved}=req.body
    try {
        const updated = await Visit.findByIdAndUpdate(id,{approved},{ new: true }).populate ('userId',['yourName','gender','BirthDate','mobileNumber','emailAddress']);        
        res.send(updated);

    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}


module.exports = {
    getDoctor,
    doctorProfile,
    postDoctor,
    editDoctorById,
    deleteDoctorById,
    doctorLogin,
    doctorHome,
    booking,
    getBooks,
    getOneBook,
    aproveBook

}