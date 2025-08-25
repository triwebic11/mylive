const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const cron = require("node-cron");
const jwt = require("jsonwebtoken");
// const {
//   processMonthlyUserRankAndFunds,
// } = require("./utils/fullMonthlyLevelCommissionProcessor");
const accountInfoRoutes = require("./routes/accountInfoRoutes");
const withdrawRoutes = require("./routes/withdrawRequests");
const packageRequestRoutes = require("./routes/packageRequestRoutes");
const kycRoutes = require("./routes/kycRoutes");
const { default: mongoose } = require("mongoose");
const { AdminSummery } = require("./controllers/AdminSummery");
const User = require("./models/User");
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173",
  "https://shslira.com"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

mongoose.set("strictQuery", true);
// Connect MongoDB
connectDB();


app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());



//sent jwt 

app.post('/api/jwt', async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_Token, {
    expiresIn: '10h'
  })
  // console.log(token)
  res.send({ token })
})


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
app.get("/api/adminsummary", AdminSummery);
app.use("/api/adminstore", require("./routes/AdminStoraRoute"));
app.get("/api/db-stats", async (req, res) => {
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
    console.error("Error fetching DB stats:", error);
    res.status(500).json({ message: "Failed to fetch DB stats" });
  }
});

// app.use("/api/uploads", require("./routes/uploadRoute"));


const checkExpiredUsers = async () => {
  const now = new Date();

  const expiredUsers = await User.find({
    packageExpireDate: { $lt: now }
  });

  expiredUsers.forEach(user => {
    console.log({
      name: user.name,
      email: user.email,
      packageExpireDate: user.packageExpireDate,
      status: "expire"
    });
  });
};

// checkExpiredUsers();

// Prottekdin raat 12 ta e check hobe
cron.schedule("* * * * *", async () => {
  const now = new Date();


  const result = await User.updateMany(
    { packageExpireDate: { $lt: now }, isActivePackage: "active" },
    { $set: { isActivePackage: "expire" } }
  );

  // console.log(`Updated ${result?.modifiedCount} users to expire.`);

  // update hoye jawa users abar fetch kore log korbo
  const expiredUsers = await User.find({
    packageExpireDate: { $lt: now },
    isActivePackage: "expire"
  });
  // console.log("Expired users:", expiredUsers)
  // console.log("Expired packages updated:", now.toLocaleString("en-BD", { timeZone: "Asia/Dhaka" }));
});
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
