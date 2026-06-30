const express= require("express");
const path= require('path');
const rootDir = require('../utils/pathUtils')


const userRouter= express.Router();
const {getIndex, getBookings, getHomes, getFavouriteList, postAddtoFavourite, getHomeDetails, postDeleteFromFavourites, getHomeRule, postBookings} =require('../controllers/homeController');
userRouter.get('/',getIndex);
userRouter.get('/homes',getHomes);
userRouter.get('/bookings',getBookings )
userRouter.get('/favourites',getFavouriteList )
userRouter.post('/favourites',postAddtoFavourite )
userRouter.get('/homes/:homeId',getHomeDetails )
userRouter.post('/favourites/delete/:homeId', postDeleteFromFavourites)
userRouter.get('/homeRule/:homeId', getHomeRule)
userRouter.post('/bookings/:homeId',postBookings )


module.exports= {userRouter};