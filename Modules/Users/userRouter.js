const express = require('express');
const {
    validateUser,
    hashingPassword,
    upload
} = require('../Middlewares')
const {
    getUser,
    userProfile,
    postUser,
    deleteUserById,
    editUserById,
    login,
    homeLog,
    getMyAppointments,
    delOneAppointment
} = require('./userController');
const userRouter = express.Router();

userRouter.get('/', getUser);
userRouter.get('/:id', userProfile);
userRouter.get('/home', homeLog);
userRouter.post('/signUp', upload.single("image"),hashingPassword, postUser);
userRouter.post('/login', login);
userRouter.patch('/:id', validateUser, hashingPassword, editUserById);
userRouter.delete('/:id', deleteUserById);
userRouter.get('/:id/appointments', getMyAppointments);
userRouter.delete('/appointments/:id', delOneAppointment);


module.exports = userRouter;