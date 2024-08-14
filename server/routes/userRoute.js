const express = require("express");
const {
  registerUser,
  authUser,
  getAllUsers,
} = require("../controllers/userControllers");
const authorizeToken = require("../middleware/authenToken");
const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", authorizeToken, getAllUsers);
module.exports = router;
