const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Regular user registration (always creates regular users)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (always as regular user)
    const user = new User({
      email: email.toLowerCase(),
      password,
      role: "user", // Force role to be user
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      user: {
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      user: {
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Secure admin creation route (protected by special key)
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    console.log("Attempting admin creation...");
    console.log("Secret key received:", secretKey);
    console.log("Expected secret key:", process.env.ADMIN_SECRET_KEY);

    // Verify secret key
    if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
      console.log("Secret key verification failed");
      return res.status(403).json({
        message: "Unauthorized - Invalid secret key",
        received: secretKey ? "Key provided but invalid" : "No key provided",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new User({
      email: email.toLowerCase(),
      password,
      role: "admin",
    });

    await admin.save();
    console.log("Admin created successfully:", admin.email);

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({
      message: "Error creating admin",
      error: error.message,
    });
  }
});

// Verify token route
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Admin routes
router.get(
  "/admin/users",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find({}).select("-password");
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }
);

router.put(
  "/admin/users/:userId/role",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error updating user role" });
    }
  }
);

module.exports = router;
