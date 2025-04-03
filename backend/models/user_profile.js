const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true
    },
    platform:{
        type:String, 
        enum: ["xbox" ,"steam", "pc","manually"],
        default:"pc",
        required: true
      },
    level:{
        type:Number,
        reduired:true
    },
    profilePic:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('user_profile',profileSchema);