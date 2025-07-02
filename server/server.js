const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const accountInfoRoutes = require("./routes/accountInfoRoutes");
const withdrawRoutes = require("./routes/withdrawRequests");

const packageRequestRoutes = require("./routes/packageRequestRoutes");

const app = express();
const server = http.createServer(app); // ✅ Updated line
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://shslira.com"],
    methods: ["GET", "POST"],
  },
});

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cashonDelivery", require("./routes/CashOnDelivery"));
app.use("/api/profile", accountInfoRoutes);
app.use("/api/products", require("./routes/AddProductsroute"));
app.use("/api/packages", require("./routes/PackagesRoute"));
app.use("/api/conversion-rate", require("./routes/conversionRoutes"));
app.use("/api/package-requests", packageRequestRoutes);
app.use("/api/withdraw-requests", withdrawRoutes);

// Root route
app.get("/", (req, res) => {
  console.log("server is running");
  res.send("API is running...");
});

// Example test route (optional)
app.get("/api/user/register", async (req, res) => {
  const users = await users.find();
  res.json(users);
});

// ✅ Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("conversionRateUpdated", ({ pointToTaka }) => {
    console.log("🌀 New rate broadcast:", pointToTaka);
    io.emit("conversionRateChanged", { pointToTaka });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


// Optionally pass io to routes via app.set
app.set("io", io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
