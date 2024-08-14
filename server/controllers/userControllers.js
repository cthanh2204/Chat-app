const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      accessToken: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Fail to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      accessToken: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or pasword");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search_name
    ? {
        $or: [
          { name: { $regex: req.query.search_name, $options: "i" } },
          { email: { $regex: req.query.search_name, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(keyword).where({
      _id: { $ne: req.user._id },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = { registerUser, authUser, getAllUsers };
