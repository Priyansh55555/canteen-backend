import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// 1) CONNECT TO MONGODB
// -------------------------------------------------------------
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("📦 MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// -------------------------------------------------------------
// 2) CREATE HTTP SERVER
// -------------------------------------------------------------
const server = http.createServer(app);

// -------------------------------------------------------------
// 3) SOCKET.IO SETUP
// -------------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: process.env.FORONTENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// -------------------------------------------------------------
// 4) START SERVER
// -------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// -------------------------------------------------------------
// 5) HANDLE UNEXPECTED ERRORS
// -------------------------------------------------------------

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

// -------------------------------------------------------------
// 6) GRACEFUL SHUTDOWN
// -------------------------------------------------------------
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");

  io.close(() => {
    console.log("Socket.IO closed");
  });

  server.close(() => {
    console.log("HTTP server closed");

    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

// export io if you need it in controllers
export { io };
