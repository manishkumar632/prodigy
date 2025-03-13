import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import socketService from "../utils/socket";
import EmojiPicker from "emoji-picker-react";
import { format } from "date-fns";
import {
  FaceSmileIcon,
  PaperClipIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import ConfirmDialog from "../components/ConfirmDialog";
import AddContactModal from "../components/AddContactModal";

export default function Chat() {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("chats");
  const [showChatOptions, setShowChatOptions] = useState(false);
  const messageContainerRef = useRef(null);

  const createGroupChat = async (name, users) => {
    try {
      const res = await fetch("http://localhost:5000/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, users }),
      });
      const data = await res.json();
      if (res.ok) {
        setChats([data, ...chats]);
        setSelectedChat(data);
      }
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (user) {
      socketService.connect(user._id);
      fetchChats();
      socketService.onMessage((data) => {
        // Update messages if it's the current chat
        if (selectedChat?._id === data.chatId) {
          setMessages((prev) => [...prev, data]);
          scrollToBottom();
        }
        // Update the chats list to show latest message
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat._id === data.chatId) {
              return { ...chat, latestMessage: data };
            }
            return chat;
          });
          // Move the updated chat to top
          const chatIndex = updatedChats.findIndex(
            (chat) => chat._id === data.chatId
          );
          if (chatIndex > -1) {
            const [chat] = updatedChats.splice(chatIndex, 1);
            updatedChats.unshift(chat);
          }
          return updatedChats;
        });
      });
      socketService.onTyping(({ userId, isTyping }) => {
        setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
      });
    }
    return () => socketService.disconnect();
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      const unreadMessages = messages.filter(
        (m) => !m.readBy.includes(user._id) && m.sender._id !== user._id
      );

      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages.map((m) => m._id));
      }
    }
  }, [selectedChat, messages]);

  useEffect(() => {
    if (user) {
      fetchChats();
      fetchContacts();
    }
  }, [user]);

  // Add this new useEffect to fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat?._id]);

  // Add new useEffect for auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add this new function to fetch messages
  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/message/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/contacts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id,
        }),
      });
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage("");
      socketService.sendMessage({
        ...data,
        receiverId: selectedChat.users.find((u) => u._id !== user._id)._id,
      });
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", selectedChat._id);

    try {
      const res = await fetch("http://localhost:5000/api/chat/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      socketService.sendMessage({
        ...data,
        receiverId: selectedChat.users.find((u) => u._id !== user._id)._id,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleTyping = () => {
    socketService.sendTyping({
      chatId: selectedChat._id,
      userId: user._id,
      isTyping: true,
      receiverId: selectedChat.users.find((u) => u._id !== user._id)._id,
    });

    // Clear typing indicator after 3 seconds
    setTimeout(() => {
      socketService.sendTyping({
        chatId: selectedChat._id,
        userId: user._id,
        isTyping: false,
        receiverId: selectedChat.users.find((u) => u._id !== user._id)._id,
      });
    }, 3000);
  };

  const markMessagesAsRead = async (messageIds) => {
    try {
      await fetch("http://localhost:5000/api/chat/messages/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ messageIds }),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const startChat = async (userId) => {
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const startChatWithContact = async (contactUserId) => {
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: contactUserId }),
      });
      const data = await res.json();
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setActiveTab("chats");
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const removeContact = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/contacts/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (res.ok) {
        fetchContacts();
        setChats(
          chats.filter(
            (chat) =>
              !chat.users.some((u) => u._id === userId) || chat.isGroupChat
          )
        );
        if (selectedChat?.users.some((u) => u._id === userId)) {
          setSelectedChat(null);
        }
      }
    } catch (error) {
      console.error("Error removing contact:", error);
    }
  };

  const leaveGroup = async (chatId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/group/leave`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId }),
      });
      if (res.ok) {
        setChats(chats.filter((c) => c._id !== chatId));
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const setSelectedChatAndFetchMessages = async (chat) => {
    setSelectedChat(chat);
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/message/${chat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (!chat || !chat.users) return false;
    const otherUser = chat.users.find((u) => u._id !== user._id);
    const chatName = chat.isGroupChat ? chat.chatName : otherUser?.username;
    return chatName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={logout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <div className="flex max-h-screen">
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowContactSearch(true)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <UserPlusIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 ${
                  activeTab === "chats" ? "border-b-2 border-blue-500" : ""
                }`}
                onClick={() => setActiveTab("chats")}
              >
                Chats
              </button>
              <button
                className={`flex-1 py-2 ${
                  activeTab === "contacts" ? "border-b-2 border-blue-500" : ""
                }`}
                onClick={() => setActiveTab("contacts")}
              >
                Contacts
              </button>
            </div>
            <input
              type="text"
              placeholder={
                activeTab === "chats" ? "Search chats..." : "Search contacts..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="overflow-y-auto flex-1 scrollbar h-[calc(100vh-190px)]">
            {activeTab === "chats"
              ? filteredChats.map((chat) => {
                  const otherUser = chat.users?.find((u) => u._id !== user._id);
                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChatAndFetchMessages(chat)}
                      className={`p-4 cursor-pointer hover:bg-gray-100 ${
                        selectedChat?._id === chat._id ? "bg-gray-100" : ""
                      }`}
                    >
                      <h3 className="font-medium">
                        {chat.isGroupChat ? chat.chatName : otherUser?.username}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.latestMessage?.content}
                      </p>
                    </div>
                  );
                })
              : contacts.map((contact) => (
                  <div
                    key={contact.user._id}
                    onClick={() => startChatWithContact(contact.user._id)}
                    className="p-4 cursor-pointer hover:bg-gray-100"
                  >
                    <h3 className="font-medium">{contact.user.username}</h3>
                    <p className="text-sm text-gray-500">
                      {contact.user.email}
                    </p>
                  </div>
                ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : selectedChat.users.find((u) => u._id !== user._id)
                        .username}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setShowChatOptions(!showChatOptions)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <EllipsisVerticalIcon className="h-6 w-6" />
                  </button>
                  {showChatOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                      {selectedChat.isGroupChat ? (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to leave this group?"
                              )
                            ) {
                              leaveGroup(selectedChat._id);
                            }
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Leave Group
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const otherUser = selectedChat.users.find(
                              (u) => u._id !== user._id
                            );
                            if (
                              confirm(
                                `Remove ${otherUser.username} from contacts?`
                              )
                            ) {
                              removeContact(otherUser._id);
                            }
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Remove from Contacts
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                ref={messageContainerRef}
                className="flex-1 max-h-[85vh] scrollbar overflow-y-auto p-4 space-y-4 scroll-smooth"
              >
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === user._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-[70%] break-words">
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender._id === user._id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {message.fileUrl ? (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {message.content || "Attached file"}
                          </a>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(message.createdAt), "HH:mm")}
                      </div>
                    </div>
                  </div>
                ))}
                {Object.entries(typingUsers).map(
                  ([userId, isTyping]) =>
                    isTyping &&
                    userId !== user._id && (
                      <div key={userId} className="text-gray-500 text-sm">
                        Typing...
                      </div>
                    )
                )}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaceSmileIcon className="h-6 w-6 text-gray-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <PaperClipIcon className="h-6 w-6 text-gray-500" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    className="flex-1 px-4 py-2 border rounded-full"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-full"
                  >
                    Send
                  </button>
                </div>
                {showEmoji && (
                  <div className="absolute bottom-20 right-4">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
      {showContactSearch && (
        <AddContactModal
          isOpen={showContactSearch}
          onClose={() => setShowContactSearch(false)}
          onAddContact={fetchContacts}
        />
      )}
    </>
  );
}
