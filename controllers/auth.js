const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    
    res.render('auth/login', { pageTitle: "Login", isLoggedIn: req.session.isLoggedIn ,
         errors:[],
            oldInput: {email: ""}
    });
}


exports.postLogin =  async(req, res, next) => {
    const {email, password}= req.body;
    const user = await User.findOne({email});
    
    if(!user){

       return  res.status(422).render('auth/login', {
            pageTitle: 'Login',
            isLoggedIn: req.session.isLoggedIn,
            errors:['user not found'],
            oldInput: {email}
        })
        
    }
    const isMatched =await bcrypt.compare(password,user.password )
    if(!isMatched){
         return  res.status(422).render('auth/login', {
            pageTitle: 'Login',
            isLoggedIn: req.session.isLoggedIn,
            errors:['Invalid password'],
            oldInput: {email}
        })

    }
    
        req.session.user={_id: user._id.toString(), userType:user.userType};
        req.session.isLoggedIn = true;
         req.session.save((err)=>{
            if(err){
                console.log(err)
            }
            res.redirect('/');
        });
        

}
exports.postLogout = (req, res, next) => {
    req.session.isLoggedIn = false;
    req.session.destroy()

    res.clearCookie("connect.sid");
   return  res.redirect('/login');
}
exports.getSignUp = (req, res, next) => {
  
    res.render('auth/SignUp', {
        pageTitle: "SignUp", isLoggedIn: req.session.isLoggedIn, errors: [],
        oldInput: { firstName: "", lastName: "", email: "", userType: "", terms: "" }
    });
}
exports.postSignUp = [
    check('firstName')
        .notEmpty()
        .withMessage("First name is required")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First name should be atleast two character")
        .matches(/^[A-Za-z\s]*$/)
        .withMessage("First name should contain only alphabets"),

    check('lastName')
        .trim()
        .matches(/^[A-Za-z\s]*$/)
        .withMessage("First name should contain only alphabets"),

    check('email')
        .isEmail()
        .withMessage("Please enter valid email")
        .normalizeEmail(),

    check("password")
        .notEmpty()
        .withMessage("please enter the password")
        .isLength({ min: 4 }).withMessage("password nust be of atleast 4 characters")
        .matches(/[A-Z]/).withMessage("password must contain a uppercase letter")
        .matches(/[a-z]/).withMessage("password must contain a lowercase letter")
        .matches(/[0-9]/).withMessage("password must contain a digit")
        .matches(/[!@&]/).withMessage("password must contain a special character")
        .trim(),

    check("confirm password")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password do not matches")
            }
            return true;
        }),
    check('userType')
        .notEmpty()
        .withMessage("Please select the user type")
        .isIn(['host', 'guest'])
        .withMessage("invalid User type"),

    check('terms')
        .notEmpty()
        .withMessage("Please accept the terms and conditions")
        .custom((value, { req }) => {
            if (value != 'on') {
                throw new Error("Check the box")
            }
            return true;
        }),


    async(req, res, next) => {

        const { firstName, lastName, userType, email, password, terms } = req.body;
        let errors = validationResult(req);
        errors= errors.errors.map(err => err.msg);
        const userExists = await User.findOne({ email });
        if (userExists) {
            errors.push("Email already exists");
        }


        if (!errors.length == 0) {
            return res.status(422).render('auth/signup',
                {
                    pageTitle: "Sign Up",
                    errors: errors,
                    isLoggedIn: req.session.isLoggedIn,
                    oldInput: { firstName, lastName, email, userType, terms }
                }
            )
        }
        const user = new User({ firstName, lastName, userType, email })
        bcrypt.hash(password, 12).then((hashedPassword) => {
            user.password = hashedPassword;
            user.save().then(() => {
                res.redirect("/login");
            }).catch((err) => {
                return res.status(422).render('auth/signup',
                    {
                        pageTitle: "Sign Up",
                        errors: [err.message],
                        isLoggedIn: req.session.isLoggedIn,
                        oldInput: { firstName, lastName, email, userType, terms }
                    }
                )
            })

        })



    }]