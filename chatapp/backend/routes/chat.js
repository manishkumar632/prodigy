import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  sendMessage,
  getMessages,
  uploadFile,
  markMessagesAsRead,
  leaveGroup,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);
router.route("/").post(accessChat).get(fetchChats);
router.route("/group").post(createGroupChat);
router.route("/group/add").put(addToGroup);
router.route("/group/remove").put(removeFromGroup);
router.route("/group/leave").put(protect, leaveGroup);
router.route("/message").post(sendMessage);
router.route("/message/:chatId").get(getMessages);
router.post("/upload", protect, upload.single("file"), uploadFile);
router.post("/messages/read", protect, markMessagesAsRead);

export default router;
