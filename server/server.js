const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cashonDelivery", require("./routes/CashOnDelivery"));







app.get("/", (req, res)=>{
    console.log("server is running")
    res.send("API is running...")
})

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
