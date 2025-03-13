import express from "express";
import {
  register,
  login,
  getMe,
  searchUsers,
  addContact,
  getContacts,
  removeContact,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, searchUsers);
router.post("/contacts", protect, addContact);
router.get("/contacts", protect, getContacts);
router.delete("/contacts/:userId", protect, removeContact);

export default router;
