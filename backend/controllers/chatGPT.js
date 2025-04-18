// server.js - Express backend for Forza Horizon 5 Stat Tracker
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  platform: { type: String, required: true },
  gameId: { type: String },
  emailAddress: { type: String },
  level: { type: String, default: "1" },
  createdAt: { type: Date, default: Date.now }
});

// Stats Schema
const statsSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  stats: {
    victories: { type: String, default: "0" },
    numberofCarsOwned: { type: String, default: "0" },
    garageValue: { type: String, default: "0" },
    timeDriven: { type: String, default: "0" },
    mostValuableCar: { type: String, default: "None" },
    totalWinnningsinCR: { type: String, default: "0" },
    favoriteCar: { type: String, default: "None" },
    longestSkillChain: { type: String, default: "0" },
    distanceDrivenInMiles: { type: String, default: "0" },
    longestJump: { type: String, default: "0" },
    topSpeed: { type: String, default: "0" },
    biggestAir: { type: String, default: "0" }
  },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Stats = mongoose.model('Stats', statsSchema);

// Configure CORS for frontend access
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5174', 'https://forza-horizon-statstracker.onrender.com'];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Debug middleware to log request details
app.use((req, res, next) => {
  // Only log for specific routes
  if (req.path.includes('/api/signup') || req.path.includes('/api/update-stats')) {
    console.log('\n------- REQUEST DEBUG INFO -------');
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    
    // Log body for non-multipart requests
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
      console.log('Body:', req.body);
    } else {
      console.log('Multipart form detected, body content not shown');
    }
    
    console.log('------- END DEBUG INFO -------\n');
  }
  next();
});

// Field name normalization middleware
app.use((req, res, next) => {
  // Only apply to specific routes
  if ((req.path === '/api/signup' || req.path === '/api/update-stats') && req.method === 'POST') {
    // This runs before multer processes the request
    // Map frontend field names to backend expected names if needed
    if (req.body) {
      // Handle possible frontend field name variations
      if (req.body.gamertag && !req.body.userName) {
        req.body.userName = req.body.gamertag;
      }
      
      if (req.body.selectedPlatform && !req.body.platform) {
        req.body.platform = req.body.selectedPlatform;
      }
      
      if (req.body.email && !req.body.emailAddress) {
        req.body.emailAddress = req.body.email;
      }
    }
  }
  
  next();
});

// Configure multer for in-memory storage (not saved to disk)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 4194304 // 4MB in bytes
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Route to handle user signup with stats extraction
app.post('/api/signup', (req, res, next) => {
  console.log("Processing signup request...");
  // Use multer dynamically to handle the upload and capture all fields
  upload.array('images', 2)(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ 
        success: false, 
        message: err.message,
        error: 'file_upload_error'
      });
    }
    
    // Log the form fields after multer processing
    console.log("Form fields after multer processing:", req.body);
    console.log("Files received:", req.files ? req.files.length : 0);
    
    // Check for required fields
    let userName = req.body.userName || req.body.gamertag;
    let platform = req.body.platform || req.body.selectedPlatform;
    let password = req.body.password;
    
    const missingFields = [];
    if (!userName) missingFields.push('userName/gamertag');
    if (!password) missingFields.push('password');
    if (!platform) missingFields.push('platform/selectedPlatform');
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
        receivedFields: Object.keys(req.body)
      });
    }
    
    // Continue with normal processing
    next();
  });
}, async (req, res) => {
  try {
    // Normalize field names
    const userName = req.body.userName || req.body.gamertag;
    const password = req.body.password;
    const platform = req.body.platform || req.body.selectedPlatform;
    const gameId = req.body.gameId || '';
    const emailAddress = req.body.emailAddress || req.body.email || '';
    
    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Process the images and extract stats
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: 'Please upload exactly 2 stats screenshots' });
    }
    
    // Process each image and extract stats using GPT-4 Vision
    console.log("Starting GPT-4 Vision processing for signup...");
    const extractedStats = await processStatsImages(req.files, userName);
    console.log("GPT-4 Vision processing completed with stats:", extractedStats);
    
    // Verify the extracted player name matches the username
    if (extractedStats.playerName && 
        extractedStats.playerName.toLowerCase() !== userName.toLowerCase()) {
      return res.status(400).json({ 
        success: false,
        message: 'The gamertag in your screenshots does not match your chosen username. Please use your actual in-game username.' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      userName,
      password: hashedPassword,
      platform,
      gameId,
      emailAddress,
      level: extractedStats.playerLevel || '1'
    });
    
    await user.save();
    
    // Create stats record
    const stats = new Stats({
      userName,
      stats: {
        victories: extractedStats.victories || '0',
        numberofCarsOwned: extractedStats.carsOwned || '0',
        garageValue: extractedStats.garageValue || '0',
        timeDriven: extractedStats.timeDriven || '0',
        mostValuableCar: extractedStats.mostValuableCar || 'None',
        totalWinnningsinCR: extractedStats.totalCredits || '0',
        favoriteCar: extractedStats.favoriteCar || 'None',
        longestSkillChain: extractedStats.longestSkillChain || '0',
        distanceDrivenInMiles: extractedStats.distanceDriven || '0',
        longestJump: extractedStats.longestJump || '0',
        topSpeed: extractedStats.topSpeed || '0',
        biggestAir: extractedStats.biggestAir || '0'
      }
    });
    
    await stats.save();
    
    // Generate JWT
    const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      userName: user.userName
    });
    
  } catch (error) {
    console.error('Error processing signup:', error);
    
    // More detailed error response
    res.status(500).json({
      success: false,
      message: error.message,
      error: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

// Route to handle stats update
app.post('/api/update-stats', authenticateToken, (req, res, next) => {
  console.log("Processing stats update request...");
  // Use multer dynamically to handle the upload and capture all fields
  upload.array('images', 2)(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ 
        success: false, 
        message: err.message,
        error: 'file_upload_error'
      });
    }
    
    // Log the form fields after multer processing
    console.log("Update stats form fields:", req.body);
    console.log("Update stats files received:", req.files ? req.files.length : 0);
    
    // Check for required fields
    const userName = req.body.userName || '';
    
    if (!userName) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required field: userName',
        missingFields: ['userName']
      });
    }
    
    // Continue with normal processing
    next();
  });
}, async (req, res) => {
  try {
    const userName = req.body.userName;
    
    // Verify user permissions (only allow users to update their own stats)
    if (req.user.userName !== userName) {
      return res.status(403).json({ message: 'You can only update your own stats' });
    }
    
    // Process the images and extract stats
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: 'Please upload exactly 2 stats screenshots' });
    }
    
    // Process each image and extract stats using GPT-4 Vision
    console.log("Starting GPT-4 Vision processing for update...");
    const extractedStats = await processStatsImages(req.files, userName);
    console.log("GPT-4 Vision processing completed with stats:", extractedStats);
    
    // Verify the extracted player name matches the username
    if (extractedStats.playerName && 
        extractedStats.playerName.toLowerCase() !== userName.toLowerCase()) {
      return res.status(400).json({ 
        success: false,
        message: 'The gamertag in your screenshots does not match your username. Please upload screenshots from your own account.' 
      });
    }
    
    // Update stats
    await Stats.findOneAndUpdate(
      { userName },
      {
        stats: {
          victories: extractedStats.victories || '0',
          numberofCarsOwned: extractedStats.carsOwned || '0',
          garageValue: extractedStats.garageValue || '0',
          timeDriven: extractedStats.timeDriven || '0',
          mostValuableCar: extractedStats.mostValuableCar || 'None',
          totalWinnningsinCR: extractedStats.totalCredits || '0',
          favoriteCar: extractedStats.favoriteCar || 'None',
          longestSkillChain: extractedStats.longestSkillChain || '0',
          distanceDrivenInMiles: extractedStats.distanceDriven || '0',
          longestJump: extractedStats.longestJump || '0',
          topSpeed: extractedStats.topSpeed || '0',
          biggestAir: extractedStats.biggestAir || '0'
        },
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );
    
    // Update user level if available
    if (extractedStats.playerLevel) {
      await User.findOneAndUpdate(
        { userName },
        { level: extractedStats.playerLevel },
        { new: true }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Stats updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating stats:', error);
    
    // More detailed error response
    res.status(500).json({
      success: false,
      message: error.message,
      error: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

// Route to get user stats
app.get('/api/stats/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    
    const stats = await Stats.findOne({ userName: username });
    if (!stats) {
      return res.status(404).json({ message: 'Stats not found' });
    }
    
    res.status(200).json({
      success: true,
      stats: stats.stats
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route to search for a user
app.post('/api/search', async (req, res) => {
  try {
    const { userName } = req.body;
    
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      userName: user.userName,
      platform: user.platform,
      level: user.level
    });
    
  } catch (error) {
    console.error('Error searching for user:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({
      success: true,
      token,
      userName: user.userName
    });
    
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Account deletion route
app.delete('/api/delete', authenticateToken, async (req, res) => {
  try {
    const { userName } = req.body;
    
    // Verify user permissions (only allow users to delete their own account)
    if (req.user.userName !== userName) {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }
    
    // Delete user and their stats
    await User.findOneAndDelete({ userName });
    await Stats.findOneAndDelete({ userName });
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Helper function to process stats images using GPT-4 Vision API
async function processStatsImages(files, expectedUserName) {
  const statResults = [];
  
  for (const file of files) {
    try {
      console.log(`Processing file: ${file.originalname}`);
      
      // Convert buffer to base64
      const base64Image = file.buffer.toString('base64');
      const fileExtension = path.extname(file.originalname).substring(1);
      
      // Call OpenAI's API to analyze the image
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are a specialized AI designed to extract Forza Horizon 5 statistics from screenshots. IMPORTANT: The playerName field is critical - make sure to accurately detect and extract the gamertag/username shown in the stats page. Return the data in JSON format with the following structure: { playerName, playerLevel, carsOwned, totalCredits, victories, garageValue, timeDriven, mostValuableCar, favoriteCar, longestSkillChain, distanceDriven, longestJump, topSpeed, biggestAir } Extract only what you can see, use null for missing values. If you cannot confidently identify the player name, set playerName to null."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract all Forza Horizon 5 stats from this image. Pay special attention to the player's gamertag/username displayed in the stats page." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/${fileExtension};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });
      
      // Parse the response to extract JSON
      const content = response.choices[0].message.content;
      let statsData;
      
      try {
        // Try to parse JSON directly from the response
        statsData = JSON.parse(content);
      } catch (e) {
        // If direct parsing fails, try to extract JSON using regex
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          statsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON from API response');
        }
      }
      
      console.log(`Extracted stats from file ${file.originalname}:`, statsData);
      statResults.push(statsData);
      
    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
      throw new Error(`GPT-4 Vision processing failed: ${error.message}`);
    }
  }
  
  // Combine stats from multiple images
  return mergeStats(statResults);
}

// Helper function to merge stats from multiple images
function mergeStats(statResults) {
  if (statResults.length === 0) return {};
  if (statResults.length === 1) return statResults[0];
  
  const combinedStats = {};
  const statKeys = [
    'playerName', 
    'playerLevel', 
    'carsOwned', 
    'totalCredits',
    'victories',
    'garageValue',
    'timeDriven',
    'mostValuableCar',
    'favoriteCar',
    'longestSkillChain',
    'distanceDriven',
    'longestJump',
    'topSpeed',
    'biggestAir'
  ];
  
  for (const key of statKeys) {
    // Find first non-null value for each stat
    for (const result of statResults) {
      if (result[key] !== null && result[key] !== undefined) {
        combinedStats[key] = result[key];
        break;
      }
    }
  }
  
  return combinedStats;
}

// Add a simple status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

// Start the server
app.listen(port, () => {
  console.log(`Forza Horizon 5 Stats API running on port ${port}`);
});