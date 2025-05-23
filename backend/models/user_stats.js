const mongoose = require('mongoose')
const statsSchema = new mongoose.Schema({

    userName:{
     type: String,
     required: true
    },
    timeDriven:{
        type: String,
        required: true
       },
    numberofCarsOwned:{
        type: Number,
        required: true
       },
    mostValuableCar:{
        type: String,
        required: true
       },
    totalWinnningsinCR:{
        type: Number,
        required: true
       },
    favoriteCar:{
        type: String,
        required: true
       },
    garageValue:{
        type: String,
        required: true
       },
    longestSkillChain:{
        type: String,
        required: true
       },
    distanceDrivenInMiles:{
        type: String,
        required: true
       },
    longestJump:{
        type: String,
        required: true
       },
    topSpeed:{
        type: String,
        required: true
       },
    biggestAir:{
        type: String,
        required: true
       },
    victories:{
        type: Number,
        required: true
       },
})

module.exports = mongoose.model('user_stats', statsSchema);