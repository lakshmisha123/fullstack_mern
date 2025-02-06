const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const validateSignUpRequest = [
body("firstName").notEmpty().withMessage("First Name is required"),
body("lastName").notEmpty().withMessage("Last Name is required"),
body("email").isEmail().withMessage("Valid Email required"),
body("password")
   .isLength({ min: 6 })
   .withMessage("Password must be at least 6 character long"),
];
const validateSignIpRequest = [
body("email").isEmail().withMessage("Valid Email required"),
body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
]

const isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
 
  if (errors.array().length > 0) {
      return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: errors.array()[0].msg });
  }
  next();
};
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.sendStatus(403); // Forbidden
    }
    console.log(user)

    req.user = user; // Attach user information to request object
    next(); // Proceed to the next middleware
  });
};



module.exports = {
  validateSignUpRequest,
  isRequestValidated,
  validateSignIpRequest,
  authenticateToken
};
