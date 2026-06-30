const express= require("express");
const hostRouter= express.Router();
const path = require('path');
const rootDir = require('../utils/pathUtils')
const hostController = require('../controllers/hostController')
hostRouter.get('/addHome',hostController.getaddHome)
hostRouter.get('/hostHomeList',hostController.getHostHomes)


hostRouter.post('/addHome', hostController.postaddHome)
hostRouter.post('/editHome/:homeId', hostController.postEditHome)
hostRouter.get('/editHome/:homeId', hostController.getEditHome);
hostRouter.post('/deleteHome/:homeId', hostController.postDeleteHome )

module.exports= {hostRouter};

