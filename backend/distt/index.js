"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_connect_1 = require("./connect/db_connect");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cloudinary_1 = require("cloudinary");
const cors_1 = __importDefault(require("cors"));
// ✅ CommonJS way to get __dirname in .ts
const __dirname = path_1.default.resolve();
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({
    limit: "5mb",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/posts", post_routes_1.default);
app.use("/api/notifications", notification_route_1.default);
// ✅ Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "frontend", "dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "frontend", "dist", "index.html"));
    });
}
// Start DB + Server
(0, db_connect_1.db_connect)(app);
