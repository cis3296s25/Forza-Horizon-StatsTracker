const express = require('express');
const router = express.Router();
const { newUser, loginUsers, logoutUsers, searchUsers, updateUsers, deleteUsers } = require('../controllers/users');

// Define routes with controller functions
router.post("/newUser", newUser);
router.post("/login", loginUsers);
router.post("/logout", logoutUsers);
router.post("/search", searchUsers);
router.post("/update", updateUsers);
router.post("/delete", deleteUsers);

module.exports = router;


/*
//getting all users
router.get('/', async (req,res) =>{

    try{
        const users = await hub_user.find()
        res.json(users)

    }catch (err){
      res.status(500).json({message: err.message})
    }
})

//getting one user
router.get('/:id', getUser, (req,res) =>{
res.json(res.hub_user)
})

//creating user
router.post('/', async (req,res) =>{
const user = new hub_user({
    userName: req.body.userName,
    platform: req.body.platform,
    password: req.body.password,
})
try {
const newUser = await user.save()
res.status(201).json(newUser)
}catch(err){
res.status(400).json({message: err.message})
 }
})



router.patch('/;id',getUser, async(req,res) =>{
    if(req.body.userName != null){
        res.hub_user.userName = req.body.userName
    }
     if(req.body.platform != null){
        res.hub_user.platform = req.body.platform
    }
     if(req.body.password != null){
        res.hub_user.password = req.body.password
    }
   try{
    const updatedUser = await res.hub_user.save()
    res.json(updatedUser)
   }catch(err){
    res.status(400).json({message: err.message})
   }
})



router.delete('/:id',getUser, async (req,res) =>{
try{
await res.hub_user.remove()
res.json({ message: "Deleted user"})
}catch(err){
res.status(500).json({message: err.message})
}
})

async function getUser(req,res,next) {
    let user 
try{
user = await hub_user.findById(req.params.id)
if(user == null){
    return res.status(404).json({ message: "Cannot find user"})
}
}catch(err){
return res.status(500).json({message: err.message})
}
res.hub_user = user
next()
}*/
