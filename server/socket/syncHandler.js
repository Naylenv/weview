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
  socket.on('sync-play', ({ roomId }) => {
    if (!roomStore.isHost(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      roomStore.updatePlayState(roomId, { ...room.playState, isPlaying: true });
      socket.to(roomId).emit('sync-play', { time: room.playState.currentTime });
    }
  });

  socket.on('sync-pause', ({ roomId }) => {
    if (!roomStore.isHost(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      roomStore.updatePlayState(roomId, { ...room.playState, isPlaying: false });
      socket.to(roomId).emit('sync-pause', { time: room.playState.currentTime });
    }
  });

  socket.on('sync-seek', ({ roomId, time }) => {
    if (!roomStore.isHost(roomId, socket.id)) return;

    const room = roomStore.getRoom(roomId);
    if (room) {
      roomStore.updatePlayState(roomId, { ...room.playState, currentTime: time });
      socket.to(roomId).emit('sync-seek', { time });
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
      socket.emit('sync-state', {
        video: room.video,
        playState: room.playState,
        danmakuHistory: room.danmakuHistory
      });
    }
  });
};
