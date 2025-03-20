const mongoose = require("mongoose")

const connectDB = async (uri) => {
    try{

        console.log("Attempting connection to mongodb.......")
        await mongoose.connect(uri)

        console.log("Connection to MongoDB sucessful")
    } catch(err){
        console.error("Failed to connnect to MongoDb", err.message)
        process.exit(1);
    }
}

module.exports = connectDB;
