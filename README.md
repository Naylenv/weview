# WeView

多人同步观影 Web 应用，支持实时播放同步和弹幕互动。

## 功能

- 房间系统：创建/加入房间
- 电影院模式：禁用播放器直接交互，通过中控台统一控制
- 实时同步：播放/暂停/进度同步
- 权限控制：房主可开启"允许所有人控制"
- 弹幕系统：实时弹幕显示

## 同步方案

采用**电影院模式**设计：用户无法直接操作播放器，所有控制通过中控台发起。

```
┌─────────────┐     sync-play/pause/seek     ┌─────────────┐
│  控制者     │  ─────────────────────────►  │   服务端    │
│ (房主/授权) │                              │  Socket.IO  │
└─────────────┘                              └──────┬──────┘
                                                    │
                                    io.to(roomId).emit()
                                                    │
                    ┌───────────────┬───────────────┼───────────────┐
                    ▼               ▼               ▼               ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
              │ 成员 A   │   │ 成员 B   │   │ 成员 C   │   │ 控制者   │
              │ dp.seek()│   │ dp.seek()│   │ dp.seek()│   │ dp.seek()│
              │ dp.play()│   │ dp.play()│   │ dp.play()│   │ dp.play()│
              └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

**核心逻辑：**
1. 播放器禁用交互（CSS `pointer-events: none` + DPlayer `hotkey: false`）
2. 控制操作通过 ControlPanel 组件发起
3. 服务端验证权限后广播给**所有用户**（包括发起者）
4. 所有客户端收到事件后执行相同操作，保证状态一致

**权限检查：**
```javascript
canControl(roomId, socketId) {
  const room = getRoom(roomId);
  if (room.allowAllControl) return true;
  return room.hostId === socketId;
}
```

## 技术栈

| 前端 | 后端 |
|------|------|
| Vue 3 + Vite | Node.js + Express |
| Socket.IO Client | Socket.IO |
| DPlayer | Multer |

## 快速开始

```bash
# 本地开发
npm install && cd client && npm install && cd ..
npm run dev

# Docker 部署
docker compose up -d --build
```

## 部署

### Docker（推荐）

```bash
git clone https://github.com/Naylenv/weview.git
cd weview && docker compose up -d --build
```

访问 `http://服务器IP:3000`

### Cloudflare Tunnel（可选）

1. 在 [Cloudflare Zero Trust](https://one.dash.cloudflare.com) 创建 Tunnel
2. 配置 `.env` 填入 Token
3. 编辑 `docker-compose.yml` 取消 cloudflared 注释
4. 配置域名路由：Service Type `HTTP`，URL `weview:3000`

### CDN 缓存（可选）

在 Cloudflare Rules → Cache Rules 添加规则：
- URI 路径包含 `/uploads/`
- 边缘 TTL: 1 个月

## 项目结构

```
client/src/
├── components/
│   ├── ControlPanel.vue  # 播放中控台
│   ├── DanmakuLayer.vue  # 弹幕层
│   └── ...
├── composables/
│   ├── useRoom.js        # 房间状态
│   └── useSocket.js      # Socket 封装
└── views/
    └── Room.vue          # 房间页

server/
├── socket/
│   ├── syncHandler.js    # 同步逻辑
│   └── roomHandler.js    # 房间管理
└── store/
    └── roomStore.js      # 内存存储
```

## License

AGPL-3.0
