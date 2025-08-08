const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
// const cron = require("node-cron");
// const {
//   processMonthlyUserRankAndFunds,
// } = require("./utils/fullMonthlyLevelCommissionProcessor");
const accountInfoRoutes = require("./routes/accountInfoRoutes");
const withdrawRoutes = require("./routes/withdrawRequests");
const packageRequestRoutes = require("./routes/packageRequestRoutes");
const kycRoutes = require("./routes/kycRoutes");
const { default: mongoose } = require("mongoose");
const { AdminSummery } = require("./controllers/AdminSummery");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://shslira.com"],
    methods: ["GET", "POST", "PUT"],
  },
});
mongoose.set('strictQuery', true);
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
app.use("/api/kyc", kycRoutes);
app.use("/api/dsp", require("./routes/dspRoutes"));
app.use("/api/admin-orders", require("./routes/adminOrderRoute"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/updateRank", require("./routes/RankUpgradeRequests"));
app.use("/api/inventory", require("./routes/dspInventoryRoute"));
app.use('/api/adminstore', require("./routes/AdminStoraRoute"))
app.get('/api/adminsummery', AdminSummery)


app.get('/api/db-stats', async (req, res) => {
  try {
    // যদি connection এখনও তৈরি না হয়
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ message: "MongoDB not connected yet" });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: "DB object is not available" });
    }

    const stats = await db.stats();

    res.json({
      db: stats.db,
      collections: stats.collections,
      dataSizeMB: (stats.dataSize / 1024 / 1024).toFixed(2),
      storageSizeMB: (stats.storageSize / 1024 / 1024).toFixed(2),
      indexSizeMB: (stats.indexSize / 1024 / 1024).toFixed(2),
      avgObjSize: stats.avgObjSize,
    });
  } catch (error) {
    console.error('Error fetching DB stats:', error);
    res.status(500).json({ message: 'Failed to fetch DB stats' });
  }
});

// app.use("/api/uploads", require("./routes/uploadRoute"));

// cron.schedule("* * * * *", async () => {
//   // console.log("📆 Monthly commission running from server.js...");
//   await processMonthlyUserRankAndFunds();
// });

// Root route
app.get("/", (req, res) => {
  // console.log("server is running");
  res.send("API is running...");
});

// ✅ Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("conversionRateUpdated", ({ pointToTaka }) => {
    // console.log("🌀 New rate broadcast:", pointToTaka);
    io.emit("conversionRateChanged", { pointToTaka });
  });

  socket.on("disconnect", () => {
    // console.log("🔴 Client disconnected:", socket.id);
  });
});

// Optionally pass io to routes via app.set
app.set("io", io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
