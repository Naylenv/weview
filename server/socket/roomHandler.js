const { v4: uuidv4 } = require('uuid');
const roomStore = require('../store/roomStore');

module.exports = function(io, socket) {
  // 创建房间
  socket.on('create-room', ({ nickname }) => {
    const roomId = uuidv4().slice(0, 8);
    const room = roomStore.createRoom(roomId, socket.id, nickname);

    socket.join(roomId);
    socket.roomId = roomId;
    socket.nickname = nickname;

    socket.emit('room-created', {
      roomId,
      room: {
        ...room,
        isHost: true,
        allowAllControl: room.allowAllControl
      }
    });

    console.log(`房间 ${roomId} 已创建，房主: ${nickname}`);
  });

  // 加入房间
  socket.on('join-room', ({ roomId, nickname }) => {
    const room = roomStore.getRoom(roomId);

    if (!room) {
      socket.emit('room-error', { message: '房间不存在' });
      return;
    }

    roomStore.joinRoom(roomId, socket.id, nickname);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.nickname = nickname;

    const isHost = roomStore.isHost(roomId, socket.id);
    const updatedRoom = roomStore.getRoom(roomId);

    // 通知加入者
    socket.emit('room-joined', {
      roomId,
      room: {
        ...updatedRoom,
        isHost,
        allowAllControl: updatedRoom.allowAllControl
      }
    });

    // 通知房间其他成员
    socket.to(roomId).emit('member-joined', {
      member: { id: socket.id, name: nickname, isHost: false },
      members: updatedRoom.members
    });

    console.log(`${nickname} 加入房间 ${roomId}`);
  });

  // 离开房间
  socket.on('leave-room', () => {
    handleLeaveRoom(io, socket);
  });

  // 断开连接时自动离开房间
  socket.on('disconnect', () => {
    handleLeaveRoom(io, socket);
  });
};

function handleLeaveRoom(io, socket) {
  const roomId = socket.roomId;
  if (!roomId) return;

  const room = roomStore.leaveRoom(roomId, socket.id);
  socket.leave(roomId);

  if (room) {
    io.to(roomId).emit('member-left', {
      memberId: socket.id,
      members: room.members,
      newHostId: room.hostId
    });
  }

  console.log(`${socket.nickname || socket.id} 离开房间 ${roomId}`);
}
