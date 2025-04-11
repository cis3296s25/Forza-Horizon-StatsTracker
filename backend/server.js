const dotenv = require('dotenv');
dotenv.config();
const { connectDB } = require('./connection.js');
const app = require('./app');

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";

console.log("Env test | MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB(mongoURI);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});