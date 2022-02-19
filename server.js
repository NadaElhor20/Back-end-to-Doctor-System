const express = require('express')
const mongoose = require('mongoose');
const app = express()
require('dotenv').config();

const userRouter = require('./Modules/Users/userRouter');
const doctorRouter=require('./Modules/Doctors/doctorRouter');
const port = 5000;

app.use(express.json());


app.use(['/users','/user'], userRouter);
app.use(['/doctor','/doctors'],doctorRouter);
app.use("/img", express.static("images"))


mongoose.connect('mongodb://localhost:27017/The-Doctors',(err)=>{
    if(err) process.exit(1);
    console.log("Connected to Database Successfully");
});

app.listen(port, () => {
  console.log(`express app listening on port ${port}`)
})


app.use((err, req, res, next) => {
    res.send({
        status: err.statusCode,
        message: err.message,
        errors: err.errors || []
    });
})


