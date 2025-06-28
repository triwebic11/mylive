const express = require("express");

const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const accountInfoRoutes = require("./routes/accountInfoRoutes");
const withdrawRoutes = require("./routes/withdrawRequests");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cashonDelivery", require("./routes/CashOnDelivery"));
app.use("/api/profile", accountInfoRoutes);
app.use("/api/withdraw-requests", withdrawRoutes);

app.get("/", (req, res) => {
  console.log("server is running");
  res.send("API is running...");
});
app.get("/api/user/register", async (req, res) => {
  const users = await users.find(); // MongoDB থেকে সব user আনছে
  res.json(users); // client কে পাঠাচ্ছে
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
