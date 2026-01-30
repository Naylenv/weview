const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const uploadRoutes = require("./routes/upload");
const roomHandler = require("./socket/roomHandler");
const syncHandler = require("./socket/syncHandler");
const danmakuHandler = require("./socket/danmakuHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// 静态文件服务 - 视频文件
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 生产环境下服务前端静态文件
app.use(express.static(path.join(__dirname, "../client/dist")));

// API 路由
app.use("/api", uploadRoutes);

// SPA 路由 - 所有未匹配的路由返回 index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Socket.IO 连接处理
io.on("connection", (socket) => {
  console.log("用户连接:", socket.id);

  roomHandler(io, socket);
  syncHandler(io, socket);
  danmakuHandler(io, socket);

  socket.on("disconnect", () => {
    console.log("用户断开:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
