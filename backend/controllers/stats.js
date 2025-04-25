const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');
const path = require('path');
const multer = require("multer");
const { OpenAI } = require('openai');


// Initialize GPT
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });


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

// Images are processed in memory using OpenAI
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
  
exports.getUserStats = async (req, res) => {
    const userNameFromToken = req.user.userName;
    const { userName } = req.query;
    
    if (userNameFromToken !== userName) {
        return res.status(403).json({ message: "You are not authorized to access this user's stats" });
    }

    try {
        const stats = await user_stats.findOne({ userName });
        console.log("User stats:", stats); // Log the fetched stats

        if (!stats) {
            return res.status(404).json({ message: "User stats not found" });
        }

        res.status(200).json({ message: "Stats fetched successfully", stats });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: "Error searching user stats", error: error.message });
    }
};

exports.getAllUserStats = async (req, res) => {
    try {
        const verifiedUsers = await hub_user.find({ verify: true });
    
        const leaderboard = await Promise.all(
          verifiedUsers.map(async (user) => {
            const stats = await user_stats.findOne({userName: new RegExp(`^${user.userName}$`, 'i')
              });
              
    
            if (!stats) {
                return null; 
            }
    
            return {
              userName: user.userName,
              victories: stats.victories,
              distanceDrivenInMiles: stats.distanceDrivenInMiles,
              numberofCarsOwned: stats.numberofCarsOwned,
            };
          })
        );
    
        
        const filteredLeaderboard = leaderboard.filter(entry => entry !== null);
    
        res.status(200).json(filteredLeaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Server error' });
      }

}




exports.getProfileStats = async (req, res) => {
    const userName = req.user.userName;

    if (!userName) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        const profile_stats = await user_profile.findOne({ userName });
        if (!profile_stats) {
            return res.status(404).json({ message: "User profile not found" });
        }

        const { level, profilePic: avatar, platform } = profile_stats;

        res.status(200).json({
            message: "Profile stats fetched successfully",
            level,
            avatar,
            platform
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            message: "Error getting data",
            error: error.message
        });
    }
};


exports.getCompareStats = async (req, res) => {
    const { userName1, userName2 } = req.query; 

    if (!userName1 || !userName2) {
        return res.status(400).json({ message: "Both user names are required for comparison" });
    }

    try {
        const usersStats = await user_stats.find({ userName: { $in: [userName1, userName2] } });

        if (usersStats.length !== 2) {
            return res.status(404).json({ message: "One or both users not found" });
        }

        const stats = usersStats.map(userStat => ({
            userName: userStat.userName,
            stats: {
                timeDriven: userStat.timeDriven,
                numberOfCarsOwned: userStat.numberofCarsOwned,
                mostValuableCar: userStat.mostValuableCar,
                totalWinnningsinCR: userStat.totalWinnningsinCR,
                favoriteCar: userStat.favoriteCar,
                garageValue: userStat.garageValue,
                longestSkillChain: userStat.longestSkillChain,
                distanceDrivenInMiles: userStat.distanceDrivenInMiles,
                longestJump: userStat.longestJump,
                topSpeed: userStat.topSpeed,
                biggestAir: userStat.biggestAir,
                victories: userStat.victories
            }
        }));

        res.status(200).json({
            message: "Stats comparison successful",
            users: stats
        });

    } catch (error) {
        res.status(500).json({ message: "Error comparing stats", error: error.message });
    }
};


exports.updateUserStats = async (req, res) => {
    try {
        console.log("Processing stats update request...");
        
        // Extract user info from request
        const tokUserName = req.user.userName;
        const { userName } = req.body;
        const images = req.files;
        
        console.log("User from token:", tokUserName);
        console.log("User from body:", userName);
        console.log("Received files:", images ? images.length : 0);
        
        // Authorization check
        if (userName !== tokUserName) {
            return res.status(403).json({ message: "Not authorized to edit this user's stats" });
        }
        
        // Check if user exists
        const existingUser = await hub_user.findOne({ userName });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
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
            { new: true }
        );
        
        if (!updatedStats) {
            return res.status(404).json({ message: "No user stats found" });
        }
        
        // Update user level if available in extracted stats
        if (extractedStats.playerLevel) {
            await user_profile.findOneAndUpdate(
                { userName },
                { level: extractedStats.playerLevel },
                { new: true }
            );
        }
        
        res.status(200).json({ 
            success: true,
            message: "Stats updated successfully",
            updatedStats
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