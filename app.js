// const dns= require('dns');
// dns.setServers(['8.8.8.8', '1.1.1.1'])
require('dotenv').config();
const express = require('express');
const path = require('path');
const app=express();
const {userRouter} = require('./routes/userRouter');
const {hostRouter} = require('./routes/hostRouter');

const rootDir = require('./utils/pathUtils');
const {error404} = require('./controllers/error');

const mongoose = require('mongoose');
const expressValidator = require('express-validator')
const { authRouter } = require('./routes/authRouter');
const session = require('express-session');
const strict = require('assert/strict');
const mongodbStore= require('connect-mongodb-session')(session);
const multer = require('multer');
function randomString (num){
    const data = 'ABCDEFGHIJKL1234567890abcdgedid';
    let randomStr= '';
    for(let i=0;i<num;i++){
        randomStr+= data[Math.floor(Math.random()*(data.length-1))]
    }
    return randomStr;

}
const storage=multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'uploads')
    },
     
    filename: (req,file,cb)=>{
        cb(null,randomString(10)+'-'+file.originalname)
    }

})
const filefFilter =(req, file,cb)=>{
    if(file.mimeType==='image/png'||file.mimeType==='image/jpg'||file.mimeType==='image/jpeg'||file.mimeType==='application/pdf'){
        cb(null, true)
    }
    else{
        cb(null, true);
    }
}

const multerOprions = {storage, filefFilter};
app.use(multer(multerOprions).fields([{name:'photo', maxCount:1}, {name:'rule', maxCount:1}]))
// app.use("/host/uploads",express.static(path.join(rootDir, 'uploads')))
// app.use("/homes/uploads",express.static(path.join(rootDir, 'uploads')))
// in ejs file img path should start with / so that browser treats it
//  as absolute path otherwise it treats as relative path like i have 
// to search inside home so it make the url as /home/uploads/image.jpg. 
//But when you write forward slash browser treats it as absolute path 
// and make the url as /upload/image.jpg which matches with the middleware
app.use("/uploads",express.static(path.join(rootDir, 'uploads')))

app.use(express.static(path.join(rootDir,'public')))
app.use(express.urlencoded());
app.set('views','views');
app.set('view engine','ejs');
const store = new mongodbStore ({
    uri:process.env.MONGODB_URI,
    collection:"sessions"
})
app.use( session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store
    // cookie: {
    //     maxAge:1000*10,
    //     httpOnly:true,
    //     // secure:true, 
    //     // sameSite:strict
    // }
}))
app.use("/host", (req,res,next)=>{
    if(req.session.isLoggedIn&&req.session.user.userType==='host'){
       
    next()
    }
    else{
      return  res.redirect('/');

    }
    // next()
})
app.use(authRouter);
app.use( userRouter)
app.use('/host', hostRouter)

app.use(error404, {pageTitle:"404", currentPage:"404", isLoggedIn:req.session.isLoggedIn})

const PORT =3000;
const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI).then(()=>{
    console.log("success")
    app.listen(3000, ()=>{
        console.log("server is running");
        
    })

}).catch(err=>{console.log("failed to start")})

