// 内存存储房间数据
const rooms = new Map();

const roomStore = {
  createRoom(roomId, hostId, hostName) {
    const room = {
      id: roomId,
      hostId,
      members: [{ id: hostId, name: hostName, isHost: true }],
      video: null,
      playState: {
        isPlaying: false,
        currentTime: 0,
        lastUpdate: Date.now()
      },
      danmakuHistory: [],
      allowAllControl: false,
      createdAt: Date.now()
    };
    rooms.set(roomId, room);
    return room;
  },

  getRoom(roomId) {
    return rooms.get(roomId);
  },

  joinRoom(roomId, memberId, memberName) {
    const room = rooms.get(roomId);
    if (!room) return null;

    const existingMember = room.members.find(m => m.id === memberId);
    if (!existingMember) {
      room.members.push({ id: memberId, name: memberName, isHost: false });
    }
    return room;
  },

  leaveRoom(roomId, memberId) {
    const room = rooms.get(roomId);
    if (!room) return null;

    room.members = room.members.filter(m => m.id !== memberId);

    // 如果房主离开，转移房主权限给下一个成员
    if (room.hostId === memberId && room.members.length > 0) {
      room.hostId = room.members[0].id;
      room.members[0].isHost = true;
    }

    // 如果房间没人了，删除房间
    if (room.members.length === 0) {
      rooms.delete(roomId);
      return null;
    }

    return room;
  },

  setVideo(roomId, video) {
    const room = rooms.get(roomId);
    if (room) {
      room.video = video;
      room.playState = { isPlaying: false, currentTime: 0, lastUpdate: Date.now() };
    }
    return room;
  },

  updatePlayState(roomId, playState) {
    const room = rooms.get(roomId);
    if (room) {
      room.playState = { ...playState, lastUpdate: Date.now() };
    }
    return room;
  },

  addDanmaku(roomId, danmaku) {
    const room = rooms.get(roomId);
    if (room) {
      room.danmakuHistory.push(danmaku);
      // 只保留最近 500 条弹幕
      if (room.danmakuHistory.length > 500) {
        room.danmakuHistory = room.danmakuHistory.slice(-500);
      }
    }
    return room;
  },

  isHost(roomId, memberId) {
    const room = rooms.get(roomId);
    return room && room.hostId === memberId;
  },

  canControl(roomId, memberId) {
    const room = rooms.get(roomId);
    if (!room) return false;
    if (room.allowAllControl) return true;
    return room.hostId === memberId;
  },

  setAllowAllControl(roomId, allow) {
    const room = rooms.get(roomId);
    if (room) {
      room.allowAllControl = allow;
    }
    return room;
  }
};

module.exports = roomStore;
