const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

exports.getUserStats = async (req, res) => {
    const { userName } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "User dose not exists" });
    }

    try {
        const stats = await user_stats.findOne({ userName });

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
    const { userName } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        const profile_stats = await user_profile.findOne({ userName });
        if (!profile_stats) {
            return res.status(404).json({ message: "User profile not found" });
        }

        const { level, profilePic: avatar } = profile_stats;

        res.status(200).json({
            message: "Profile stats fetched successfully",
            level,
            avatar
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({
            message: "Error getting data",
            error: error.message
        });
    }
};
