const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

  const picURL = await cloudinary.uploader.upload(pic);
  const user = await User.create({
    name,
    email,
    password,
    pic: picURL?.url,
  });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: picURL?.url,
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

const editUser = asyncHandler(async (req, res) => {
  const { name, pic } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let picURL;
    if (pic) {
      try {
        picURL = await cloudinary.uploader.upload(pic);
      } catch (error) {
        console.log("Cloudinary upload fail", error);
        return res.status(400).json({ message: "Invalid image upload" });
      }
    }

    user.name = name || user.name;
    user.pic = picURL?.url || user.pic;
    const updateUser = await user.save();
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const detailUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(500).json({ message: "Cannot find User" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = { registerUser, authUser, getAllUsers, editUser, detailUser };
