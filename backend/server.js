const dotenv = require('dotenv');
dotenv.config()



const express = require('express');
const { connectDB } = require('./connection.js');
const cors = require('cors');

console.log("Env test | MONGO_URI:", process.env.MONGO_URI)

const port = process.env.PORT || 3000;


 const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Middleware to parse incoming JSON data
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`);
    console.log("Response Headers:", res.getHeaders());
  });
  next();
});

// Test route for API health check
app.get("/", (req, res) => {
  res.send("API is working with /api/v1");
});

const userRouter = require('./routes/users');
const statsRouter = require('./routes/stats'); 

app.use("/api/userAccount", userRouter); 
app.use("/api/userStats", statsRouter);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




/*
use this
make a new file connection.js
*/


/*
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
*/


























/*// Import required packages
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

// Create an Express app
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// MongoDB URI (replace with your actual MongoDB URI or Atlas connection string)
const mongoURI = process.env.Mongo_uri;
// Replace with your MongoDB URI if using MongoDB Atlas

// Connect to MongoDB using Mongoose


console.log("Mongo URI from .env:",mongoURI)
console.log("COnnecting to MongoDB URI:" , mongoURI);
mongoose.connect(mongoURI,)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the Forza Stats Tracker API!');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
   console.log(`server is running on port ${PORT}`);
});
*/






/*import express from "express";s
import dotenv from "dotenv";
import cors from "cors";
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();
const port = process.env.PORT || 3000;
const mongouri = process.env.Mongo_uri || "";


const connectDB = require("./db");
connectDB(mongouri);


const app = express();
app.use(cors());


app.use(express.json())
app.get("/",(req,res) => {
   res.send("api working");
} )


const userRouter = require("./routes/users.js")

app.use("/api/v1/hub_user", userRouter);


app.listen(3000, ()=> console.log("Server has started"))
*/


