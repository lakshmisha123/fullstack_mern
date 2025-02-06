const { StatusCodes } = require("http-status-codes");
const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
     return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please Provide Required Information",
     });
  }

  const hash_password = await bcrypt.hash(password, 10);
 
  const userData = {
     firstName,
     lastName,
     email,
     hash_password,
  };

  const user = await User.findOne({ email });
  if (user) {
     return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already registered",
     });
  } else {
     User.create(userData).then((data, err) => {
     if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
     else
       res
        .status(StatusCodes.CREATED)
        .json({ message: "User created Successfully" });
     });
    }
};

const signIn = async (req, res) => {
   try {
     // Check if email and password are provided
     if (!req.body.email || !req.body.password) {
       return res.status(StatusCodes.BAD_REQUEST).json({
         message: "Please enter email and password",
       });
     }
 
     // Find the user by email
     const user = await User.findOne({ email: req.body.email });
 
     // If user exists, authenticate password
     if (user) {
       if ( await user.authenticate(req.body.password) == true) {
         // Generate JWT token
         const token = jwt.sign(
           { _id: user._id, role: user.role },
           process.env.JWT_SECRET,
           { expiresIn: "30d" }
         );
         const { _id, firstName, lastName, email, role, fullName } = user;
         return res.status(StatusCodes.OK).json({
           token,
           user: { _id, firstName, lastName, email, role, fullName },
         });
       } else {
         // Password incorrect
         return res.status(StatusCodes.UNAUTHORIZED).json({
           message: "Incorrect email or password",
         });
       }
     } else {
       // User does not exist
       return res.status(StatusCodes.NOT_FOUND).json({
         message: "User not found",
       });
     }
   } catch (error) {
     // Handle other errors
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
   }
 };
 

 const userProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id:req.user._id });
    const { _id, firstName, lastName, email, role, fullName } = user;
    return res.status(StatusCodes.OK).json({
      user: { firstName, lastName, email, role, fullName },
    });
  } catch (error) {
    console.error("Error in userProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { signUp, signIn, userProfile};