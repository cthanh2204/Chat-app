const express = require("express");
const authorizeToken = require("../middleware/authenToken");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const router = express.Router();
router.post("/", authorizeToken, sendMessage);
router.get("/:chatId", authorizeToken, allMessages);

module.exports = router;
