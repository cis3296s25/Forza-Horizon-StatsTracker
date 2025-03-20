const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    userName:{
     type: String,
     required: true
    },

    platform:{
      type:String, 
      enum: ["Xbox" ,"Steam", "PC"],
      default:"PC",
      required: true
    },

    password:{
      type: String, //Need to learn bcrypt for the user passwords (Hashing in database)
      required: true,
    }

   }
)
module.exports = mongoose.model('hub_user', userSchema)