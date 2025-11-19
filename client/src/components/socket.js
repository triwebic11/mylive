// src/socket.js
import { io } from "socket.io-client";
const socket = io("https://apilira.shslira.com/api"); // ✅ বা লাইভ হলে সেই URL
export default socket;
