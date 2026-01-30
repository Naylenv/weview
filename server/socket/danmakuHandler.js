const roomStore = require('../store/roomStore');

module.exports = function(io, socket) {
  // 发送弹幕
  socket.on('send-danmaku', ({ roomId, danmaku }) => {
    const room = roomStore.getRoom(roomId);
    if (!room) return;

    const fullDanmaku = {
      ...danmaku,
      id: Date.now() + Math.random().toString(36).slice(2, 9),
      sender: socket.nickname || '匿名',
      senderId: socket.id,
      timestamp: Date.now()
    };

    roomStore.addDanmaku(roomId, fullDanmaku);

    // 广播给房间所有人（包括发送者）
    io.to(roomId).emit('new-danmaku', { danmaku: fullDanmaku });
  });

  // 获取弹幕历史
  socket.on('get-danmaku-history', ({ roomId }) => {
    const room = roomStore.getRoom(roomId);
    if (room) {
      socket.emit('danmaku-history', { history: room.danmakuHistory });
    }
  });
};
