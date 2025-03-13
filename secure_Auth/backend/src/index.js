const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Validate environment variables
if (!process.env.JWT_SECRET || !process.env.ADMIN_SECRET_KEY) {
  console.error("Required environment variables are not defined");
  console.error(
    "JWT_SECRET:",
    process.env.JWT_SECRET ? "defined" : "undefined"
  );
  console.error(
    "ADMIN_SECRET_KEY:",
    process.env.ADMIN_SECRET_KEY ? "defined" : "undefined"
  );
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const { authenticateToken } = require("./middleware/auth");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Vite's default port
    credentials: true,
  })
);
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
