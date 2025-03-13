import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("user-status", { userId, status: "online" });
  });

  socket.on("send-message", async (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive-message", data);
    }
  });

  socket.on("typing", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", data);
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUser;
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        disconnectedUser = key;
      }
    });
    if (disconnectedUser) {
      onlineUsers.delete(disconnectedUser);
      io.emit("user-status", { userId: disconnectedUser, status: "offline" });
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
