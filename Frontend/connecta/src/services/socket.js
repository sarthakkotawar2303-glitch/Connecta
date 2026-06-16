import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(url, userId) {
    if (this.socket?.connected) return;

    this.socket = io(url, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.emit("setup", userId);
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  emit(event, payload) {
    if (!this.socket) {
      console.warn(`Socket not connected. Cannot emit event: "${event}"`);
      return;
    }
    this.socket.emit(event, payload);
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

export const socketService = new SocketService();
