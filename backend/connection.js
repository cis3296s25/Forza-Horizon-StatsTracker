
const mongoose = require('mongoose');

// Connecting to MongoDB
const connectDB = async (uri) => {
    try {
        const options = {
            dbName: "Forza-Horizon-Stathub",
        };
        const connection = await mongoose.connect(uri, options);
        console.log(`DB Connected to ${connection.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
            console.error('Unexpected error:', error);
        }
        process.exit(1); // Exit process with failure
    }
};


module.exports = { connectDB };
