// src/socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // ✅ বা লাইভ হলে সেই URL
export default socket;
