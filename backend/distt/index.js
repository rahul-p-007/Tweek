"use strict";
// Load environment variables from .env
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { db_connect } = require("./connect/db_connect"); // Adjust path if needed
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const notificationRoutes = require("./routes/notification.route");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const cors = require("cors");
// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
// Middleware
app.use(express.json({
    limit: "5mb",
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
// Production mode: serve frontend build
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../../frontend/dist");
    app.use(express.static(frontendPath));
    app.get("*", (_, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}
// Connect to DB and start server
db_connect(app);
