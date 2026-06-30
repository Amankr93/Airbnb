const mongoose = require("mongoose");
const Home = require("./home");
const favouriteSchema = new mongoose.Schema({
    homeId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'Home',
        required:true,
        unique: true
    }
})
module.exports= mongoose.model('favourite', favouriteSchema);