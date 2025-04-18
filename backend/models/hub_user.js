const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    userName:{
     type: String,
     required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    platform:{
      type:String, 
      enum: ["xbox" ,"steam", "pc","manually"],
      default:"pc",
      required: true
    },

    password:{
      type: String, //Need to learn bcrypt for the user passwords (Hashing in database)
      required: true,
    },
    verify:{
      type: Boolean, //Need to learn bcrypt for the user passwords (Hashing in database)
      required: true,
    },

    gameId:{
      type: String,
      default: null,
      required: false
     },
   }
)
module.exports = mongoose.model('hub_user', userSchema)