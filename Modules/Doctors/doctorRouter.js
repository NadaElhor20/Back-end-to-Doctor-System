const express = require('express');
const {
    validateDoctor,
    hashingPassword,
    upload
} = require('../Middlewares')
const {
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
} = require('./doctorController');
const doctorRouter = express.Router();

doctorRouter.get('/', getDoctor);
doctorRouter.get('/:id', doctorProfile);
doctorRouter.get('/home', doctorHome);
doctorRouter.post('/signUp', upload.single("image"),hashingPassword, postDoctor);
doctorRouter.patch('/:id', validateDoctor, hashingPassword, editDoctorById);
doctorRouter.delete('/:id', deleteDoctorById);
doctorRouter.post('/login', doctorLogin);
doctorRouter.post('/:id/appointments', booking);
doctorRouter.get('/:id/appointments', getBooks);
doctorRouter.get('/appointments/:id', getOneBook);
doctorRouter.patch('/appointments/:id', aproveBook);



module.exports = doctorRouter;