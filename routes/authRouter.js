const express= require("express");
const authRouter= express.Router();
const path = require('path');
const rootDir = require('../utils/pathUtils')
const authcontroller = require('../controllers/auth')
authRouter.get('/login',authcontroller.getLogin)
authRouter.get('/signup',authcontroller.getSignUp)
authRouter.post('/signup',authcontroller.postSignUp)
authRouter.post('/login',authcontroller.postLogin)
authRouter.post('/logout',authcontroller.postLogout)


module.exports= {authRouter};

