import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL);
    this.socket.emit("user-online", userId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  onMessage(callback) {
    this.socket.on("receive-message", callback);
  }

  onTyping(callback) {
    this.socket.on("typing", callback);
  }

  onUserStatus(callback) {
    this.socket.on("user-status", callback);
  }

  sendMessage(data) {
    this.socket.emit("send-message", data);
  }

  sendTyping(data) {
    this.socket.emit("typing", data);
  }
}

export default new SocketService();
