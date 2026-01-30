const roomStore = require('../store/roomStore');

module.exports = function(io, socket) {
  // 选择视频
  socket.on('select-video', ({ roomId, video }) => {
    if (!roomStore.isHost(roomId, socket.id)) {
      socket.emit('sync-error', { message: '只有房主可以选择视频' });
      return;
    }

    roomStore.setVideo(roomId, video);
    io.to(roomId).emit('video-selected', { video });
    console.log(`房间 ${roomId} 选择视频: ${video.name}`);
  });

  // 播放控制同步
  socket.on('sync-play', ({ roomId, time }) => {
    if (!roomStore.canControl(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      const currentTime = time !== undefined ? time : room.playState.currentTime;
      roomStore.updatePlayState(roomId, { ...room.playState, isPlaying: true, currentTime });
      io.to(roomId).emit('sync-play', { time: currentTime });
    }
  });

  socket.on('sync-pause', ({ roomId, time }) => {
    if (!roomStore.canControl(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      const currentTime = time !== undefined ? time : room.playState.currentTime;
      roomStore.updatePlayState(roomId, { ...room.playState, isPlaying: false, currentTime });
      io.to(roomId).emit('sync-pause', { time: currentTime });
    }
  });

  socket.on('sync-seek', ({ roomId, time }) => {
    if (!roomStore.canControl(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      roomStore.updatePlayState(roomId, { ...room.playState, currentTime: time });
      io.to(roomId).emit('sync-seek', { time });
    }
  });

  // 心跳同步 - 房主定期发送当前播放状态
  socket.on('heartbeat', ({ roomId, currentTime, isPlaying }) => {
    if (!roomStore.isHost(roomId, socket.id)) return;

    roomStore.updatePlayState(roomId, { currentTime, isPlaying });
  });

  // 请求同步 - 新成员或需要重新同步时
  socket.on('request-sync', ({ roomId }) => {
    const room = roomStore.getRoom(roomId);
    if (room) {
      // 向房主请求实时状态
      io.to(room.hostId).emit('request-current-state', { requesterId: socket.id });
    }
  });

  // 房主响应实时状态请求
  socket.on('current-state-response', ({ requesterId, currentTime, isPlaying }) => {
    const roomId = socket.roomId;
    if (!roomId || !roomStore.isHost(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      // 更新服务器状态
      roomStore.updatePlayState(roomId, { currentTime, isPlaying });
      // 发送给请求者
      io.to(requesterId).emit('sync-state', {
        video: room.video,
        playState: { currentTime, isPlaying },
        danmakuHistory: room.danmakuHistory,
        allowAllControl: room.allowAllControl
      });
    }
  });

  // 更新权限设置
  socket.on('update-permission', ({ roomId, allowAllControl }) => {
    if (!roomStore.isHost(roomId, socket.id)) return;

    roomStore.setAllowAllControl(roomId, allowAllControl);
    io.to(roomId).emit('permission-updated', { allowAllControl });
    console.log(`房间 ${roomId} 权限更新: allowAllControl=${allowAllControl}`);
  });
};
