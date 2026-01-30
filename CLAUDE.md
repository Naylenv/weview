# CLAUDE.md

这是 WeView 项目的 Claude Code 上下文文件。

## 项目概述

WeView 是一个多人同步观影 Web 应用，采用前后端分离架构。

## 技术架构

### 前端 (client/)
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **视频播放**: DPlayer
- **实时通信**: Socket.IO Client
- **样式**: Scoped CSS + CSS Variables

### 后端 (server/)
- **运行时**: Node.js
- **框架**: Express
- **实时通信**: Socket.IO
- **文件上传**: Multer

## 目录结构

```
client/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── ChatBox.vue       # 弹幕记录面板
│   │   ├── DanmakuInput.vue  # 弹幕输入框
│   │   └── DanmakuLayer.vue  # 弹幕显示层
│   ├── composables/      # 组合式函数
│   │   ├── useRoom.js        # 房间状态管理
│   │   └── useSocket.js      # Socket.IO 封装
│   └── views/            # 页面组件
│       ├── Home.vue          # 首页
│       └── Room.vue          # 房间页

server/
├── index.js              # 入口文件
├── routes/
│   └── upload.js         # 视频上传/删除 API
├── socket/               # Socket.IO 事件处理
│   ├── roomHandler.js        # 房间管理
│   ├── syncHandler.js        # 播放同步
│   └── danmakuHandler.js     # 弹幕处理
└── store/
    └── roomStore.js      # 内存数据存储
```

## 常用命令

```bash
# 启动开发服务器 (前后端同时)
npm run dev

# 仅启动后端
npm run server

# 仅启动前端
npm run client

# 构建前端
npm run build
```

## 开发约定

### 代码风格
- 使用 ES6+ 语法
- Vue 组件使用 `<script setup>` 语法
- CSS 使用 BEM 风格命名或语义化类名

### UI 设计
- 主题色: 金色 (#d4a853)
- 背景色: 深黑 (#0a0a0c)
- 字体: Playfair Display (标题) + DM Sans (正文)
- 设计风格: 电影院/影院美学

### Socket 事件

**客户端 -> 服务端:**
- `create-room` - 创建房间
- `join-room` - 加入房间
- `leave-room` - 离开房间
- `select-video` - 选择视频
- `sync-play` - 同步播放
- `sync-pause` - 同步暂停
- `sync-seek` - 同步进度
- `send-danmaku` - 发送弹幕

**服务端 -> 客户端:**
- `room-created` - 房间已创建
- `room-joined` - 已加入房间
- `member-joined` - 成员加入
- `member-left` - 成员离开
- `video-selected` - 视频已选择
- `sync-play` - 播放同步
- `sync-pause` - 暂停同步
- `sync-seek` - 进度同步
- `danmaku` - 收到弹幕

## 注意事项

- 视频文件存储在 `uploads/` 目录，不纳入 Git
- 房间数据存储在内存中，服务重启后清空
- 前端开发服务器代理 `/api` 和 `/socket.io` 到后端
