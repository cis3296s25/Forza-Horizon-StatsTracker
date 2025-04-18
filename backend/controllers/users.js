const bcrypt = require('bcrypt');
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const fetch = require('node-fetch');
const user_profile = require('../models/user_profile');
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const PasswordReset = require("../models/PasswordReset");
const { sendResetEmail } = require("../mailer");

const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
};

// helper function to fetch player data for Steam or Xbox
const fetchPlayerData = async (platform, gameId) => {
    let level = 0;
    let profilePic = "";

    try {
        if (platform === "steam" && gameId) {
            // Fetch Steam level
            const profileUrlLevel = `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_API_KEY}&steamid=${gameId}`;
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


exports.newUser = async (req, res) => {

    const { userName, email, platform, password, gameId, victories, numberofCarsOwned, garageValue, timeDriven, mostValuableCar,
        totalWinnningsinCR, favoriteCar, longestSkillChain, distanceDrivenInMiles, longestJump, topSpeed, biggestAir} = req.body;

    let verify = false;
    console.log(req.body);

    try{
        const account = await hub_user.findOne({ userName });
        if (account) {
            return res.status(400).json({ message: "User already exists" });
        }
        const idCheck = await hub_user.findOne({ gameId });
        if (idCheck && idCheck.gameId != null) {
            return res.status(400).json({ message: "User already exists" });
        }        

    if (!userName || !platform || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!favoriteCar || !mostValuableCar || !longestSkillChain) {
        return res.status(400).json({message: "Not a valid response"});
    }

    if (victories < 0  || numberofCarsOwned < 0 || garageValue < 0 || timeDriven < 0 ||  totalWinnningsinCR < 0 
        || distanceDrivenInMiles < 0 || longestJump < 0 || topSpeed < 0 || biggestAir < 0) {
        return res.status(400).json({message: "Stats cannot be negative"});
    }

    if ((platform === "steam" || platform === "xbox") && !gameId) {
        console.log("error");
        return res.status(400).json({
            message: `Platform ID is required for ${platform}. Please provide your Steam/Xbox ID.`,
        });
    }
        if (platform === "steam" && gameId) {
            const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${gameId}&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.response?.games?.some(game => game.appid === 1551360)) {
                verify = true;
            } else {
                return res.status(400).json({
                    message: "Unable to verify the game. Make sure your Steam profile is public.",
                });
            }
        }

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
        /*Hashing user password for userbase storage*/ 
        let hashedPassword = await bcrypt.hash(password,10);
        // Save the new user in the database

        const { level, profilePic } = await fetchPlayerData(platform, gameId);

        const newUser = new hub_user({ userName, email, platform, password: hashedPassword, verify, gameId});

        const newUserStats = new user_stats({ userName, victories, numberofCarsOwned, garageValue,timeDriven, mostValuableCar,
            totalWinnningsinCR, favoriteCar, longestSkillChain, distanceDrivenInMiles, longestJump, topSpeed, biggestAir });
        const newUserProfile = new user_profile({userName,platform,level,profilePic});
        await newUser.save();
        await newUserStats.save();
        await newUserProfile.save();


        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating the user.', error: err.message });
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

  