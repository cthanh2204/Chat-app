const express = require("express");
const authorizeToken = require("../middleware/authenToken");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

router.post("/", authorizeToken, accessChat);
router.get("/", authorizeToken, fetchChat);
router.post("/group", authorizeToken, createGroupChat);

router.put("/rename-group", authorizeToken, renameGroup);
router.put("/group-remove", authorizeToken, removeFromGroup);
router.post("/group-add", authorizeToken, addToGroup);

module.exports = router;
