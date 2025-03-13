import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!chat) {
    chat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });
  }

  res.json(chat);
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createGroupChat = async (req, res) => {
  const { name, users } = req.body;
  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "username");
    message = await message.populate("chat");

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username avatar")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user._id,
      content: req.file.originalname,
      chat: req.body.chatId,
      fileUrl: req.file.path,
    });

    let populatedMessage = await message.populate("sender", "username");
    populatedMessage = await populatedMessage.populate("chat");

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $addToSet: { readBy: req.user._id } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: "User already in group" });
    }

    const updated = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    if (userId === chat.groupAdmin.toString()) {
      return res.status(400).json({ message: "Admin cannot be removed" });
    }

    const updated = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  const { chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // If user is admin and there are other users, transfer admin to another user
    if (
      chat.groupAdmin.toString() === req.user._id.toString() &&
      chat.users.length > 1
    ) {
      const newAdmin = chat.users.find(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      chat.groupAdmin = newAdmin;
    }

    chat.users = chat.users.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    // If no users left, delete the group
    if (chat.users.length === 0) {
      await Chat.findByIdAndDelete(chatId);
      return res.json({ message: "Group deleted" });
    }

    await chat.save();
    res.json({ message: "Left group successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
