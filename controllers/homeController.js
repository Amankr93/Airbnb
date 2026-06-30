// userRouter
const path = require('path')
const fs = require('fs')
const rootDir = require('../utils/pathUtils');

const Home = require('../models/home')
// const Favourites = require('../models/favourite')
const User = require('../models/user')


const { ObjectId } = require('mongodb/lib')
const user = require('../models/user')




exports.getIndex = async (req, res, next) => {
    const user = req.session.user;
    Home.find().then((registeredHomes) => {
        res.render('./store/index', { user, registeredHomes, pageTitle: 'Airbnb', isLoggedIn: req.session.isLoggedIn })
    })

}
exports.getHomes = (req, res, next) => {
    const user = req.session.user;

    const registeredHomes = Home.find().then((registeredHomes) => {
        res.render('store/homeList', { user, registeredHomes: registeredHomes, pageTitle: "Airbnb List", isLoggedIn: req.session.isLoggedIn })
    });
}


exports.getFavouriteList = async (req, res, next) => {
    const user = await User.findById(req.session.user._id).populate('favourites')
    if (user) {
        const favourites = user.favourites;
        res.render('./store/favouriteList', { user, favourites, pageTitle: "Favourites", currentPage: "home", isLoggedIn: req.session.isLoggedIn })
    }

    // Favourites.find()
    //     .populate('homeId')
    //     .then((favourites) => {
    //         const user =req.session.user;

    //         favourites = favourites.map((fvr) => fvr.homeId)
    //         res.render('./store/favouriteList', { user, favourites, pageTitle: "Favourites", currentPage: "home", isLoggedIn:req.session.isLoggedIn })
    //     })


}
exports.postAddtoFavourite = async (req, res, next) => {
    const homeId = req.body.id;
    const user = await User.findById(req.session.user._id)
    if (user && !user.favourites.includes(homeId)) {
        user.favourites.push(homeId);
        await user.save();

    }
    res.redirect('/favourites')


}
exports.postDeleteFromFavourites = async (req, res, next) => {
    const id = req.params.homeId;
    const user = await User.findById(req.session.user._id)
    if (user.favourites.includes(id)) {
        user.favourites = user.favourites.filter((fav) => fav != id)
        await user.save();

    }
    res.redirect('/favourites');

}

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then((home) => {
        if (!home) {
            console.log("home not found");
            // res.redirect('/homes');
        }
        else {
            const user = req.session.user;

            res.render('store/homeDetail', { user, home, pageTitle: "Home Detail", currentPage: "Home", isLoggedIn: req.session.isLoggedIn })
        }
    })

}
exports.getHomeRule = [
    (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect('/login')
        }
        next();
    }
    , async (req, res, next) => {
        const homeId = req.params.homeId;
        const home = await Home.findById(homeId);
        const filename = home.rule;
        // console.log()
        console.log(home.rule)
        const filePath = path.join(rootDir, filename);
        res.download(filePath, "HomeRule.pdf");

    }]
exports.postBookings= async (req,res,next)=>{
    const homeId = req.params.homeId;
    
    const user = await User.findById(req.session.user._id)
    if (user && !user.bookings.includes(homeId)) {
        user.bookings.push(homeId);
        
        await user.save();

    }
    res.redirect('/bookings')
}

exports.getBookings =async (req, res, next) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('bookings');
    if(user){
        const bookings = user.bookings;
        res.render('store/bookings', { user, bookings, pageTitle: "Bookings", currentPage: "My Bookings", isLoggedIn: req.session.isLoggedIn })
    }

    

}



//         res.redirect('/favourites');
//     })

// }

// hostRouter

