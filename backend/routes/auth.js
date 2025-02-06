const express = require("express");
const router = express.Router();
const { signUp, signIn, userProfile } = require("../controller/auth");
const {  
  isRequestValidated,
  validateSignUpRequest,
  validateSignIpRequest,authenticateToken,
} = require("../validators/auth");

router.route("/signin").post(express.json(), validateSignIpRequest, isRequestValidated, signIn);
router.route("/signup").post(express.json(), validateSignUpRequest, isRequestValidated, signUp);
router.route("/profile").post(express.json(), authenticateToken, userProfile);

module.exports = router;