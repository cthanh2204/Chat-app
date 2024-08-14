const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connect to Mongoose: ${conn.connection.host}`);
  } catch (error) {
    console.log("Connect to Mongoose failed: ", error.message);
    process.exit();
  }
};

module.exports = {connectDB};
