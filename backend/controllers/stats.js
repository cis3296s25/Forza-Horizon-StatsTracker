const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

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

exports.updateUserStats = async (req,res)=>{
const tokUserName = req.user.userName;
const {userName, updates} = req.body;

if(userName != tokUserName){
    return res.status(403).json({message: "Not authorized to edit this user's stats" })
}

try {
    const updatedStats = await user_stats.findOneAndUpdate(
    {userName},
    {$set: updates},
    {new: true},
    );


if(!updatedStats){
    return res.status(404).json({message: "No user stats found"})
}
res.status(200).json({message:"Stats updated sucessfully"})
}
catch(error){
res.status(500).json({message:"Error updating stats", error: error.message})
}
}
