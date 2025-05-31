"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const queueRoutes_1 = __importDefault(require("./routes/queueRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to Database
(0, database_1.connectDB)();
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/queue', queueRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
// Error Handling Middleware
app.use(errorHandler_1.errorHandler);
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
