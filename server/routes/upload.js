const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // 2GB 限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|mkv|avi|mov/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的视频格式'));
    }
  }
});

// 上传视频
router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' });
  }

  const video = {
    id: req.file.filename,
    name: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    size: req.file.size,
    uploadedAt: Date.now()
  };

  res.json({ success: true, video });
});

// 获取视频列表
router.get('/videos', (req, res) => {
  const uploadDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadDir)) {
    return res.json({ videos: [] });
  }

  const files = fs.readdirSync(uploadDir);
  const videos = files
    .filter(file => /\.(mp4|webm|mkv|avi|mov)$/i.test(file))
    .map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        id: file,
        name: file,
        url: `/uploads/${file}`,
        size: stats.size,
        uploadedAt: stats.mtimeMs
      };
    })
    .sort((a, b) => b.uploadedAt - a.uploadedAt);

  res.json({ videos });
});

// 删除视频
router.delete('/videos/:id', (req, res) => {
  const filePath = path.join(__dirname, '../../uploads', req.params.id);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: '文件不存在' });
  }
});

module.exports = router;
