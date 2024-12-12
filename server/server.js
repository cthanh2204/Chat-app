const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoute = require("./routes/userRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoute = require("./routes/chatRoute");
const bodyParser = require("body-parser");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");
const path = require("path");
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use(errorHandler);
// app.use(notFound);
// Deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
// Deployment
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server start on port ${PORT}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
