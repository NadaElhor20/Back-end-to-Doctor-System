const bcrypt = require('bcrypt');
const Joi = require('joi');
const multer = require("multer");
const path = require("path");

const validateUser = (req,res,next)=>{
    try {
        const schema = Joi.object({
        yourName: Joi.string(),
        mobileNumber: Joi.string().max(11).pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')),
        emailAddress: Joi.string().email(),
        BirthDate:Joi.string(),
        gender: Joi.string().valid('male', 'female'),
        password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')),
        admin: Joi.boolean()
    });
     Joi.attempt(req.body,schema);
        next();
    } catch (error) {
        next(error)
    }
}

const hashingPassword = async (req,res,next)=>{
    try {
        const saltRounds = 10;
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    next();
    } catch (error) {
        next(error)
    }  
}

  const validateDoctor = (req,res,next)=>{
    try {
        const schema = Joi.object({
        doctorName: Joi.string(),
        mobileNumber: Joi.string().max(11).pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')),
        emailAddress: Joi.string().email(), 
        gender: Joi.string().valid('male', 'female'),
        password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')),
        fees:Joi.string().regex(/\d{1,2}[\,\.]{1}/),
        specification:Joi.string().valid('skin', 'teeth','child','bones'),
        description:Joi.string()
    });
     Joi.attempt(req.body,schema);
        next();
    } catch (error) {
        next(error)
    }
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "images/");
	},
	filename: function (req, file, cb) {
		let extention = path.extname(file.originalname);
		cb(null, Date.now() + extention);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			// To accept the file pass
			cb(null, true);
		} else {
			console.log("only jpg, png & jpeg file supported! ");
			// To reject this file pass
			cb(null, false);
		}
	},
	// 3 MB files allowed
	limits: {
		fileSize: 1024 * 1024 * 3,
	},
});



module.exports={
    validateUser,
    hashingPassword,
    validateDoctor,
    upload
}