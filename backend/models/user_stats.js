const mongoose = require('mongoose')
const statsSchema = new mongoose.Schema({
    
    userName:{
     type: String,
     required: true
    },
    timeDriven:{
        type: String,
       },
    numberofCarsOwned:{
        type: Number,
        required: true
       },
    mostValuableCar:{
        type: String,
       },
    totalWinnningsinCR:{
        type: Number,
       },
    favoriteCar:{
        type: String,
       },
    garageValue:{
        type: String,
        required: true
       },
    longestSkillChain:{
        type: String,
       },
    distanceDrivenInMiles:{
        type: Number,
       },
    longestJump:{
        type: Number,
       },
    topSpeed:{
        type: Number,
       },
    biggestAir:{
        type: String,
       },
    victories:{
        type: Number,
        required: true
       },
})

module.exports = mongoose.model('user_stats', statsSchema);

