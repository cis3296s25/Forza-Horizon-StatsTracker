/*Bringing in libraries*/
const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const cors = require('cors');

const app = express();

app.options("*", cors());

app.use(
  cors({
    origin: `${process.env.SERVER}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);

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

module.exports = app;