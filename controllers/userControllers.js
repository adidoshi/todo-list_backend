const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const { registerValidation, loginValidation } = require("./validateUser");
const generateToken = require("../utils/generateToken");

// POST request - /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Validate user by Joi
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(404);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Some error occured!");
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// POST request - /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  try {
    // Validate user by Joi
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: false,
        content: "Invalid credentials!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// PUT request - /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

module.exports = { registerUser, loginUser, updateUserProfile };
