const hub_user = require('../models/hub_user');

exports.newUser = async (req, res) => {
    const { userName, platform, password } = req.body;
    const account = await hub_user.findOne({ userName });
    if (account) {
        return res.status(400).json({ message: "User already exists" });
    }
    if (!userName || !platform || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newUser = new hub_user({ userName, platform, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
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
        //const userStats= await user_stats.findOneAndDelete({userName});

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