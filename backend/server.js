require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Error: MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.json([
    {id: 1, name: "Kevin", email: "kevin@gmail.com"},
    {id: 2, name: "Victor", email: "Victor@gmail.com"},
    {id: 3, name: "Tirth", email: "Tirth@gmail.com"},
    {id: 4, name: "Alphin", email: "Alphin@gmail.com"},
    {id: 5, name: "Nathan", email: "Nathan@gmail.com"},
    {id: 6, name: "Meet", email: "Meet@gmail.com"}
  ]);
  
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
