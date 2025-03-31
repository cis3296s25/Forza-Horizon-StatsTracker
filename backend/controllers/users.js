import bcrypt from 'bcrypt'
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const fetch = require('node-fetch');


//https://forza-horizon-statstracker-backend.onrender.com
exports.newUser = async (req, res) => {

    const { userName, platform, password, gameId,victories,numberofCarsOwned,garageValue } = req.body;

    let verify = false;
    console.log(req.body);
    const account = await hub_user.findOne({ userName });
    if (account) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Check for required fields
    if (!userName || !platform || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Handle platform verification
    try {
        if ((platform === "steam" || platform === "xbox") && !gameId) {
            console.log("error");
            return res.status(400).json({
                message: `Platform ID is required for ${platform}. Please provide your Steam/Xbox ID.`,
            });
        }

        if (platform === "steam" && gameId) {
            const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${gameId}&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.response && data.response.games && data.response.games.length > 0) {
                const hasForza = data.response.games.some(g => g.appid === 1551360);
                if (hasForza) {
                    verify = true;
                } else {
                    console.log("error");
                    return res.status(400).json({
                        message: "We can't verify if you have the game. Change your Steam profile to public and try again.",
                    });
                }
            } else {
                return res.status(400).json({
                    message: "We can't verify if you have the game. Change your Steam profile to public and try again.",
                });
            }
        }

        if (platform === "xbox" && gameId) {
            const url = `https://xbl.io/api/v2/achievements/player/${gameId}/2030093255`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'x-authorization': `${process.env.XBOX_API_KEY}`,
                        'accept': '*/*',
                    },
                });

                if (!response.ok) {
                    return res.status(400).json({
                        message: "We can't verify if you have the game.",
                    });
                }
                verify = true; // Assume verification success on valid API response
            } catch (error) {
                console.error('Error fetching Xbox data:', error);
                return res.status(500).json({ message: 'Error verifying Xbox game.', error: error.message });
            }
        }

        // Manual Verification (No gameId required)
        if (platform === "manual") {
            verify = false; // Manual users remain unverified initially
        }

        /*Hashing user password for userbase storage*/ 
        let hashedPassword = await bcrypt.hash(password,10);
        // Save the new user in the database

        const newUser = new hub_user({ userName, platform, password: hashedPassword, verify });
        const newUserStats = new user_stats({ userName, victories, numberofCarsOwned, garageValue });
        await newUser.save();
        await newUserStats.save();


        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: 'Error creating user.', error: err.message });
    }
};

exports.loginUsers = async (req, res) => {
    const {userName, password} = req.body;
    try{
        if(!userName){
            return res.status(400).json({message: "Username not found"});
        }
        // will need to updated this after encrying and decrypting the password
        if(!password){
            return res.status(400).json({message: "No password provided or password is incorrect"});
        }
        const user = await hub_user.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.status(200).json({message: "Login successful"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error logging in", error: error.message});
    }
};

// will need to fix logoutUsers with the jwt token
exports.logoutUsers = async (req, res) => {
    try{
        res.status(200).json({message: "Logout successful"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error logging out", error: error.message});
    }
};


// will need to updated this once we have the profile page ready
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
        res.status(200).json({ message: "User found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error searching user", error: error.message });
    }
};


exports.updateUsers = async (req, res) => {
};

// will need to updated this once we have the stats ready
exports.deleteUsers = async (req, res) => {
    const {userName} = req.body;
    try{
        const user = await hub_user.findOneAndDelete({userName});
        const userStats= await user_stats.findOneAndDelete({userName});

        if(!user && !userStats){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error deleting user", error: error.message});
    }
}

exports.getUserStats = async (req, res) => {
    const { userName } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "User is not logged in" });
    }

    try {
        const stats = await user_stats.findOne({ userName });

        if (!stats) {
            return res.status(404).json({ message: "User stats not found" });
        }

        res.status(200).json({stats });  // Return user stats if found
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: "Error searching user stats", error: error.message });
    }
};

exports.compareUsers = async(req,res)=>{
const {userA, userB} = req.query;
if(!userA || !userB){
    return res.status(400).json({message: "Both userA and userB must be provided"})
}

try{

const userAstats = await user_stats.findOne({username: userA});
const userBstats = await user_stats.findOne({username: userB});
if(!userAstats || !userBstats){
    return res.status(400).json({message: "One or both users are not found in our database"});
}

const userStats = {
    userA: userAstats,
    userB: userBstats
}

res.status(200).json(userStats);

}catch(error){
    console.error('Error fetching user stats:', error);
    res.status(500).json({message:"Error searching user stats", error:error.message});
}

}
