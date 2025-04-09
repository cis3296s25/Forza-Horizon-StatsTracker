// server.js
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./db");

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
