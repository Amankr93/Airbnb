const path = require('path')
const fs = require('fs')
const rootDir = require('../utils/pathUtils');

const Home = require('../models/home')

const User = require('../models/user')


const { ObjectId } = require('mongodb/lib')
const user = require('../models/user');



exports.getaddHome = (req, res, next) => {

    const user = req.session.user;

    res.render('host/addHome.ejs', { user, pageTitle: "addHome", editing: false, isLoggedIn: req.session.isLoggedIn })
}
exports.postaddHome = (req, res, next) => {

    const { houseName, price, location, rating, description } = req.body;

    if (!req.files ) {
        console.log("file not uploaded")
    }
    else {
        const photo = req.files.photo[0].path;

        const rule = req.files.rule?req.files.rule[0].path: "";
        const home = new Home({ houseName, price, location, rating, photo, description, rule });

        home.save().then((home) => {
            User.findById(req.session.user._id).then((user)=>{
                
                user.homes.push(home._id)
                user.save()
              
                res.redirect('/host/hostHomeList');
            }).catch((err)=>{
                console.log("home not uploaded in host database", home);
            })
            

        });
    }




}
exports.postEditHome = (req, res, next) => {

    const { houseName, price, location, rating } = req.body;
    const id = req.params.homeId;
    const home = Home.findById(id).then((home) => {
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
   
        if (req.files) {
            if (req.files.photo) {
                const photoPath = path.join(rootDir, home.photo);
                fs.unlink(photoPath, (err) => {
                    console.log(err)
                })
               home.photo = req.files.photo[0].path; 
            }
            if (req.files.rule) {
                const rulePath = path.join(rootDir, home.rule);
                fs.unlink(rulePath, (err) => {
                    console.log(err)
                })
               home.rule = req.files.rule[0].path; 
            }
            
        }
        home.save().then(() => {
            console.log("updated")
        }).catch((err) => {
            console.log("error in updating")
        });
        res.redirect('/host/hostHomeList');
    }).catch((err) => {
        console.log("home not found", err)
    })





}
exports.getHostHomes =async (req, res, next) => {
    const user = await User.findById(req.session.user._id).populate('homes');
    if(user){
        const  registeredHomes = user.homes;
        
        

        res.render('host/hostHomeList', { user, registeredHomes: registeredHomes, pageTitle: "Host Home List", currentPage: "host-home", isLoggedIn: req.session.isLoggedIn })
    }
    else{

    }



}
exports.getEditHome = (req, res, next) => {
   
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';


    Home.findById(homeId).then((homes) => {
        const home = homes;
        if (!home) {
            console.log('home not found');
        }
        else {
            const user = req.session.user;

            res.render('host/addHome', { user, home, pageTitle: "Edit Home", editing: editing, isLoggedIn: req.session.isLoggedIn })
        }

    })

}
exports.postDeleteHome = (req, res, next) => {
    const id = req.params.homeId;
    Home.findOneAndDelete({ _id: id }).then((home) => {
     
        const photoPath = path.join(rootDir, home.photo);
                fs.unlink(photoPath, (err) => {
                    console.log(err)
                })
        const rulePath = path.join(rootDir, home.rule);
                fs.unlink(rulePath, (err) => {
                    console.log(err)
                })
                const users = User.find().then((users)=>{
                    users.forEach((user)=>{
                        const homeIndex = user.homes.indexOf(id);
                        if(homeIndex!==-1){
                            user.homes.splice(homeIndex,1);
                            
                        }
                        const favouriteIndex = user.favourites.indexOf(id);
                        if(favouriteIndex!==-1){
                            user.favourites.splice(favouriteIndex,1);
                           
                        }
                        const bookingIndex = user.bookings.indexOf(id);
                        if(bookingIndex!==-1){
                            user.bookings.splice(bookingIndex,1);
                           
                        }
                        user.save().then(()=>{
                            console.log("user updated after home deletion")
                            
                        }).catch((err)=>{
                            console.log("error in updating user after home deletion", err)
                        })
                    })
                })
                res.redirect('/host/hostHomeList');
        
    }).catch((err) => {
        console.log(err);
    });
}






