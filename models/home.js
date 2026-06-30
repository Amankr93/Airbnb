const Favourites = require('./favourite');
const { ObjectId, Double } = require('mongodb/lib');
const mongoose =require('mongoose');
const homeSchema = new mongoose.Schema({
    houseName :{ type: String,
        required : true
    },
    price :{ type: Number,
        required : true
    },
    location :{ type: String,
        required : true
    },
    rating :{ type: Double,
        required : true
    },
    photo: String,
    rule:String,
    description: String,

})
homeSchema.pre("findOneAndDelete" ,async function ( next) {
    const homeId = this.getQuery()._id;
    await Favourites.deleteMany({homeId:homeId})
    
})
module.exports = mongoose.model('Home', homeSchema);
