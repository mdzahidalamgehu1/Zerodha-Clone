const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../model/UserModel");

const router = express.Router();
// login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.json({
        message: "Login Successful",
        user,
      });
    });
  })(req, res, next);
});

// logout
router.get("/logout",(req,res)=>{

req.logout(function(err){

if(err) return res.status(500).json(err);

res.json({
message:"Logout Success"
});

});

});

// current user
router.get("/user",(req,res)=>{

if(req.isAuthenticated()){
    return res.json(req.user);
}

res.status(401).json({
message:"Unauthorized"
});

});


router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration Successful",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


module.exports=router;