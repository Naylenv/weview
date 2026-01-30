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

### 安装依赖

```bash
npm install
cd client && npm install
```

### 启动开发服务器

```bash
npm run dev
```

这会同时启动：
- 后端服务: http://localhost:3000
- 前端服务: http://localhost:5173

### 生产构建

```bash
npm run build
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
└── package.json
```

## 使用说明

1. 打开首页，输入昵称
2. 点击「创建房间」成为房主，或输入房间号「加入房间」
3. 房主上传视频并选择播放
4. 房主控制播放，所有成员同步观看
5. 发送弹幕与朋友互动

## 部署

### 云服务器部署

```bash
# 克隆仓库
git clone https://github.com/Naylenv/weview.git
cd weview

# 安装依赖
npm install
cd client && npm install && cd ..

# 构建前端
npm run build

# 启动服务 (建议使用 pm2)
pm2 start server/index.js --name weview
```

### 环境变量

可选配置：
- `PORT` - 服务端口 (默认 3000)

## License

AGPL-3.0
