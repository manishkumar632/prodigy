import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  res.json(users);
};

export const addContact = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const user = await User.findById(req.user._id);

    // Check if contact already exists
    if (user.contacts.some((contact) => contact.user.toString() === userId)) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    user.contacts.push({ user: userId, name: name || undefined });
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate(
      "contacts.user",
      "username email"
    );

    res.json(populatedUser.contacts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "contacts.user",
      "username email"
    );
    res.json(user.contacts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeContact = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.contacts = user.contacts.filter(
      (contact) => contact.user.toString() !== req.params.userId
    );
    await user.save();
    res.json({ message: "Contact removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
