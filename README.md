# WeView

与朋友同步观影，共享每一个精彩瞬间。

WeView 是一个多人同步观影 Web 应用，让你和朋友可以远程一起看电影，实时同步播放进度，还能发送弹幕互动。

## 功能特性

- **房间系统** - 创建或加入房间，邀请朋友一起观影
- **视频管理** - 上传、选择、删除视频文件
- **同步播放** - 房主控制播放/暂停/进度，所有人实时同步
- **弹幕系统** - 发送彩色弹幕，实时显示在视频上
- **弹幕记录** - 查看历史弹幕消息

## 技术栈

**前端**
- Vue 3 + Vite
- Socket.IO Client
- DPlayer 视频播放器

**后端**
- Node.js + Express
- Socket.IO
- Multer (文件上传)

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install
cd client && npm install && cd ..

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

## 部署

### 方式一：Docker 一键部署（推荐）

```bash
git clone https://github.com/Naylenv/weview.git
cd weview
docker compose up -d --build
```

访问 `http://服务器IP:3000`

### 方式二：Docker + 域名（Cloudflare Tunnel）

无需开放端口，通过 Cloudflare Tunnel 安全访问。

**1. 创建 Cloudflare Tunnel**

1. 登录 [Cloudflare Zero Trust](https://one.dash.cloudflare.com)
2. 进入 **Networks** → **Tunnels** → **Create a tunnel**
3. 选择 **Cloudflared**，给 Tunnel 起个名字
4. 复制生成的 Token

**2. 配置并启动**

```bash
git clone https://github.com/Naylenv/weview.git
cd weview

# 配置 Token
cp .env.example .env
nano .env  # 填入你的 TUNNEL_TOKEN

# 启用 Cloudflare Tunnel（编辑 docker-compose.yml，取消 cloudflared 部分的注释）
nano docker-compose.yml

# 启动
docker compose up -d --build
```

**3. 配置域名路由**

回到 Cloudflare Tunnel 配置页面：
- **Subdomain**: 你想要的子域名（如 `weview`）
- **Domain**: 选择你的域名
- **Service Type**: `HTTP`
- **URL**: `weview:3000`

保存后即可通过 `https://你的域名` 访问。

### 方式三：传统部署

```bash
git clone https://github.com/Naylenv/weview.git
cd weview

npm install
cd client && npm install && cd ..
npm run build

# 使用 PM2 启动
pm2 start server/index.js --name weview
```

## 常用命令

```bash
# 查看状态
docker compose ps

# 查看日志
docker compose logs -f weview

# 重启服务
docker compose restart

# 更新部署
git pull && docker compose up -d --build

# 停止服务
docker compose down
```

## 项目结构

```
weview/
├── client/                 # 前端 Vue 应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── composables/    # 组合式函数
│   │   └── views/          # 页面
│   └── vite.config.js
├── server/                 # 后端 Node.js 服务
│   ├── routes/             # API 路由
│   ├── socket/             # Socket.IO 处理器
│   └── store/              # 数据存储
├── uploads/                # 上传的视频文件
├── docker-compose.yml      # Docker 编排配置
├── Dockerfile              # Docker 镜像构建
└── package.json
```

## 使用说明

1. 打开首页，输入昵称
2. 点击「创建房间」成为房主，或输入房间号「加入房间」
3. 房主上传视频并选择播放
4. 房主控制播放，所有成员同步观看
5. 发送弹幕与朋友互动

## License

AGPL-3.0
