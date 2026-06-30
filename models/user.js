const mongoose = require("mongoose");
const Home = require("./home");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type:String
    },
    userType: {
        type:String,
        enum: ['guest', 'host'],
        default :'guest'
    },
    email:{
        type:String, requierd: true
        , unique: true
    },
    password: {
        type:String,
        required : true
    },
    favourites: [{type: mongoose.SchemaTypes.ObjectId,
        ref: Home

    }],
    bookings: [{type: mongoose.SchemaTypes.ObjectId,
        ref: Home

    }],
    homes:[{type: mongoose.SchemaTypes.ObjectId,
        ref: Home

    }]

})
module.exports = mongoose.model('user', userSchema);