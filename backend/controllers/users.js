const bcrypt = require('bcrypt');
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const fetch = require('node-fetch');

const user_profile = require('../models/user_profile');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const PasswordReset = require("../models/PasswordReset");
const { sendResetEmail } = require("../mailer");
const multer = require("multer");
const { OpenAI } = require('openai');
const path = require('path');

// Configure multer for in-memory storage (no local saving)
const storage = multer.memoryStorage(); // This ensures files are kept in memory only
const upload = multer({ 
  storage, 
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

// Initialize GPT
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
};

// Images are processed in memory \
async function processStatsImages(files, expectedUserName) {
  const statResults = [];
  
  for (const file of files) {
    try {
      console.log(`Processing file: ${file.originalname}`);
      
      const base64Image = file.buffer.toString('base64');
      const fileExtension = path.extname(file.originalname).substring(1);
      
      // Call OpenAI's API to analyze the image
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo", // Using GPT-4 Turbo
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
        max_tokens: 2000
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
      throw new Error(`GPT-4 Turbo processing failed: ${error.message}`);
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

// Format extracted stats for database storage
function formatStatsForDatabase(extractedStats) {
  return {
    victories: Number(extractedStats.victories || 0),
    numberofCarsOwned: Number(extractedStats.carsOwned || 0),
    garageValue: String(extractedStats.garageValue || "0"),
    timeDriven: String(extractedStats.timeDriven || "0"),
    mostValuableCar: String(extractedStats.mostValuableCar || "None"),
    totalWinnningsinCR: Number(extractedStats.totalCredits || 0),
    favoriteCar: String(extractedStats.favoriteCar || "None"),
    longestSkillChain: String(extractedStats.longestSkillChain || "0"),
    distanceDrivenInMiles: String(extractedStats.distanceDriven || 0),
    longestJump: String(extractedStats.longestJump || 0),
    topSpeed: String(extractedStats.topSpeed || 0),
    biggestAir: String(extractedStats.biggestAir || "0")
  };
}

// helper function to fetch player data for Steam or Xbox
const fetchPlayerData = async (platform, gameId) => {
    let level = 0;
    let profilePic = "";

    try {
        if (platform === "steam" && gameId) {
            // Fetch Steam level
            const profileUrlLevel = `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_API_Key}&steamid=${gameId}`;
            const result_level = await fetch(profileUrlLevel);
            const data_level = await result_level.json();
            if (data_level?.response?.player_level !== undefined) {
                level = data_level.response.player_level;
            }

            // Fetch Steam avatar
            const profilePicUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${gameId}`;
            const result_Pic = await fetch(profilePicUrl);
            const data_Pic = await result_Pic.json();
            if (data_Pic?.response?.players && data_Pic.response.players.length > 0) {
                profilePic = data_Pic.response.players[0].avatar;
            }
        }

        if (platform === "xbox" && gameId) {
            // Fetch Xbox profile data
            const profileUrlStat = `https://xbl.io/api/v2/player/summary/${gameId}`;
            const responses = await fetch(profileUrlStat, {
                method: 'GET',
                headers: {
                    'x-authorization': `${process.env.XBOX_API_KEY}`,
                    accept: '*/*',
                },
            });
            const player_stats = await responses.json();
            if (player_stats?.people && player_stats.people.length > 0) {
                const player = player_stats.people[0];
                profilePic = player.displayPicRaw;
                level = player.gamerScore;
            }
        }
        if(platform == "manually"){
                level = 0;
                profilePic = "https://i.pinimg.com/736x/df/3e/38/df3e38f193873247033dfd1dbecd57ea.jpg";
        }
    } catch (error) {
        console.log(`Error fetching player data for ${platform}:`, error);
    }

    return { level, profilePic };
};

exports.requestReset = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await hub_user.findOne({ email });
      if (!user) return res.status(404).json({ message: "Email not found" });
  
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
      await PasswordReset.create({
        userId: user._id,
        tokenHash,
        expiresAt,
      });
  
      const resetLink = `${process.env.SERVER}/reset-password?token=${rawToken}`;
      await sendResetEmail(user.email, resetLink);
  
      res.json({ message: "Password reset link sent to your email!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
      const { token, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const resetRecord = await PasswordReset.findOne({ tokenHash, used: false });
  
      if (!resetRecord || resetRecord.expiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      const user = await hub_user.findById(resetRecord.userId);
      console.log(user.userName);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let hashedPassword = await bcrypt.hash(password,10);
      user.password = hashedPassword;
      await user.save();
  
      resetRecord.used = true;
      await resetRecord.save();
  
      res.json({ message: "Password has been reset." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong." });
    }
};

// Modified newUser function for React frontend
// Designed to work with React forms that upload images
// Images are only processed in memory and never saved to disk
exports.newUser = async (req, res) => {
    try {
        console.log("Processing signup request...");
        
        // Extract basic user info from request body
        const { userName, email, platform, password, gameId } = req.body;
        const images = req.files;
        
        console.log("Received fields:", { userName, email, platform });
        console.log("Received files:", images ? images.length : 0);
        
        // Check for required fields
        if (!userName || !platform || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check for image uploads
        if (!images || images.length !== 2) {
            return res.status(400).json({ message: "Please upload exactly 2 stats screenshots" });
        }
        
        // Check if user already exists
        const existingUser = await hub_user.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }
        
        // Log image information (without saving to disk)
        images.forEach((img, idx) => {
            console.log(`Image ${idx + 1}: ${img.originalname} (${img.mimetype}) - ${img.buffer.length} bytes`);
        });
        
        // Process images with OpenAI to extract stats
        console.log("Starting GPT-4 Turbo processing for signup...");
        const extractedStats = await processStatsImages(images, userName);
        console.log("GPT-4 Turbo processing completed with stats:", extractedStats);
        
        // Verify the extracted player name matches the username
        if (extractedStats.playerName && 
            extractedStats.playerName.toLowerCase() !== userName.toLowerCase()) {
            return res.status(400).json({ 
                success: false,
                message: 'The gamertag in your screenshots does not match your chosen username. Please use your actual in-game username.' 
            });
        }
        
        // Verify platform ID if needed
        let verify = false;
        if ((platform === "steam" || platform === "xbox") && !gameId) {
            return res.status(400).json({
                message: `Platform ID is required for ${platform}. Please provide your Steam/Xbox ID.`
            });
        }
        
        // Additional validation for Steam
        if (platform === "steam" && gameId) {
            const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${gameId}&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.response?.games?.some(game => game.appid === 1551360)) {
                verify = true;
            } else {
                return res.status(400).json({
                    message: "Unable to verify the game. Make sure your Steam profile is public."
                });
            }
        }
        
        // Additional validation for Xbox
        if (platform === "xbox" && gameId) {
            const url = `https://xbl.io/api/v2/achievements/player/${gameId}/2030093255`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-authorization': `${process.env.XBOX_API_KEY}`,
                    accept: '*/*',
                },
            });

            if (!response.ok) {
                return res.status(400).json({ message: "Unable to verify the Xbox game." });
            }
            verify = true;
        }

        if(platform == "manually"){
            verify = true;
        }
        
        // Hash password
        let hashedPassword = await bcrypt.hash(password, 10);
        
        // Get player data from platform
        const { level, profilePic } = await fetchPlayerData(platform, gameId);
        
        // Format stats for DB
        const formattedStats = formatStatsForDatabase(extractedStats);
        
        // Create new user
        const newUser = new hub_user({ 
            userName, 
            email, 
            platform, 
            password: hashedPassword, 
            verify, 
            gameId 
        });
        
        // Create new user stats
        const newUserStats = new user_stats({
            userName,
            ...formattedStats
        });
        
        // Create user profile with level from extracted stats or platform
        const newUserProfile = new user_profile({
            userName,
            platform,
            level: extractedStats.playerLevel || level,
            profilePic
        });
        
        // Save everything to database
        await newUser.save();
        await newUserStats.save();
        await newUserProfile.save();
        
        // Generate JWT token
        const token = generateToken(newUser);
        
        // Return success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            userName: newUser.userName
        });
        
    } catch (error) {
        console.error('Error processing signup:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                name: error.name,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
    }
};

// Function to handle updating stats with GPT-4 Turbo image processing
exports.updateUserStats = async (req, res) => {
    try {
        console.log("Processing stats update request...");
        
        // Extract user info from request body
        const { userName } = req.body;
        const images = req.files;
        
        console.log("Received fields:", { userName });
        console.log("Received files:", images ? images.length : 0);
        
        // Check for required fields
        if (!userName) {
            return res.status(400).json({ message: "Username is required" });
        }
        
        // Check if user exists
        const existingUser = await hub_user.findOne({ userName });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Verify user permissions (only allow users to update their own stats)
        // Temporarily commented out for debugging
        // if (req.user && req.user.userName !== userName) {
        //     return res.status(403).json({ message: "You can only update your own stats" });
        // }
        
        // Check for image uploads
        if (!images || images.length !== 2) {
            return res.status(400).json({ message: "Please upload exactly 2 stats screenshots" });
        }
        
        // Log image information (without saving to disk)
        images.forEach((img, idx) => {
            console.log(`Image ${idx + 1}: ${img.originalname} (${img.mimetype}) - ${img.buffer.length} bytes`);
        });
        
        // Process images with OpenAI to extract stats
        console.log("Starting GPT-4 Turbo processing for stats update...");
        const extractedStats = await processStatsImages(images, userName);
        console.log("GPT-4 Turbo processing completed with stats:", extractedStats);
        
        // Verify the extracted player name matches the username
        if (extractedStats.playerName && 
            extractedStats.playerName.toLowerCase() !== userName.toLowerCase()) {
            return res.status(400).json({ 
                success: false,
                message: 'The gamertag in your screenshots does not match your username. Please upload screenshots from your own account.' 
            });
        }
        
        // Format data for DB
        const formattedStats = formatStatsForDatabase(extractedStats);
        console.log("Formatted stats for database:", formattedStats);
        
        // Update user stats
        const updatedStats = await user_stats.findOneAndUpdate(
            { userName },
            formattedStats,
            { new: true, upsert: true }
        );
        
        if (!updatedStats) {
            console.log("Failed to update stats record");
        } else {
            console.log("Updated stats successfully:", updatedStats);
        }
        
        // Update user level if available in extracted stats
        if (extractedStats.playerLevel) {
            const updatedProfile = await user_profile.findOneAndUpdate(
                { userName },
                { level: extractedStats.playerLevel },
                { new: true }
            );
            
            if (!updatedProfile) {
                console.log("Failed to update user profile with new level");
            } else {
                console.log("Updated user profile level successfully");
            }
        }
        
        // Update platform data if applicable
        if (existingUser.platform && existingUser.gameId) {
            try {
                const { level, profilePic } = await fetchPlayerData(existingUser.platform, existingUser.gameId);
                const updatedProfile = await user_profile.findOneAndUpdate(
                    { userName },
                    {
                        level: extractedStats.playerLevel || level,
                        profilePic
                    },
                    { new: true }
                );
                
                if (!updatedProfile) {
                    console.log("Failed to update profile with platform data");
                } else {
                    console.log("Updated profile with platform data successfully");
                }
            } catch (platformError) {
                console.error("Error updating platform data:", platformError);
                // Continue execution even if platform data update fails
            }
        }
        
        // Return success response
        res.status(200).json({
            success: true,
            message: "Stats updated successfully",
            userName
        });
        
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Backend Login Handler
exports.loginUsers = async (req, res) => {
    const { userName, password } = req.body;
    try {
        if (!userName) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await hub_user.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }

        //res.status(200).json({message: "Login successful"});
        const { level, profilePic } = await fetchPlayerData(user.platform, user.gameId);
        const updatedUser = await user_profile.findOneAndUpdate(
            { userName: user.userName },  // Match the user by their username
            {
                $set: {
                    level: level,          // Update the level field
                    profilePic: profilePic // Update the profilePic field
                }
            },
            { new: true } // Option to return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User profile not found" });
        }
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
          });
    }
  catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// will need to fix logoutUsers with the jwt token
exports.logoutUsers = async (req, res) => {
    try{
        res.status(200).json({message: "Logout successful"});
    }
    catch(error){
        res.status(500).json({message: "Error logging out", error: error.message});
    }
};


exports.searchUsers = async (req, res) => {
    const { userName } = req.body; 

    if (!userName) {
        return res.status(400).json({ message: "User name is required" });
    }

    try {
        const user = await hub_user.findOne({ userName });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { level, profilePic } = await fetchPlayerData(user.platform, user.gameId);
        const updatedUser = await user_profile.findOneAndUpdate(
            { userName: user.userName },
            {
                $set: {
                    level: level,
                    profilePic: profilePic
                }
            },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User profile not found"});
        }
        const userStats = await user_stats.findOne({ userName });
        res.status(200).json({
            message: "User found",
            userName: user.userName,
            platform: user.platform,
            userStats: {
                platform: userStats.platform,
                timeDriven: userStats.timeDriven,
                numberofCarsOwned: userStats.numberofCarsOwned,
                garageValue: userStats.garageValue,
                distanceDrivenInMiles: userStats.distanceDrivenInMiles
            },
            level: updatedUser.level,
            profilePic: updatedUser.profilePic
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching user", error: error.message });
    }
};

// will need to updated this once we have the stats ready
exports.deleteUsers = async (req, res) => {
    const { userName } = req.body;
    if (!userName) {
        return res.status(400).json({ message: "User name is required" });
    }

    try{
        const user = await hub_user.findOneAndDelete({userName});
        const userStats= await user_stats.findOneAndDelete({userName});
        const userLevel = await user_profile.findOneAndDelete({userName});

        if(!user && !userStats && !userLevel){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error deleting user", error: error.message});
    }
}

exports.getUsersList = async (req, res) => {
    const { prefix = '' } = req.query; // Default to empty string if prefix is not provided
    try {
        const users = await hub_user.find({
            userName: { $regex: `^${prefix}`, $options: 'i' }
        }).select('userName');
        
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}