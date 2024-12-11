const express = require("express");
const {
  registerUser,
  authUser,
  getAllUsers,
  editUser,
  detailUser,
} = require("../controllers/userControllers");
const authorizeToken = require("../middleware/authenToken");
const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", authorizeToken, getAllUsers);
router.get("/detail", authorizeToken, detailUser);
router.put("/edit", authorizeToken, editUser);
module.exports = router;
