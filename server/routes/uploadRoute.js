// const express = require("express");
// const router = express.Router();
// const parser = require("../middlewares/multer");

// router.post("/upload", parser.single("image"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//   res.json({
//     imageUrl: req.file.path,
//     public_id: req.file.filename,
//   });
// });

// module.exports = router;
