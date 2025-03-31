const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');

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

        res.status(200).json({ message: "Stats fetched successfully", stats });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: "Error searching user stats", error: error.message });
    }
};
