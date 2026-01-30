import { ref, computed } from 'vue'
import { useSocket } from './useSocket'

const room = ref(null)
const members = ref([])
const isHost = ref(false)
const video = ref(null)
const playState = ref({ isPlaying: false, currentTime: 0 })
const danmakuHistory = ref([])
const allowAllControl = ref(false)

export function useRoom() {
  const { socket, emit, on, off } = useSocket()

  const createRoom = (nickname) => {
    emit('create-room', { nickname })
  }

  const joinRoom = (roomId, nickname) => {
    emit('join-room', { roomId, nickname })
  }

  const leaveRoom = () => {
    emit('leave-room')
    resetState()
  }

  const selectVideo = (videoData) => {
    if (!room.value || !isHost.value) return
    emit('select-video', { roomId: room.value.id, video: videoData })
  }

  const syncPlay = (time) => {
    if (!room.value) return
    if (!canControl()) return
    emit('sync-play', { roomId: room.value.id, time })
  }

  const syncPause = (time) => {
    if (!room.value) return
    if (!canControl()) return
    emit('sync-pause', { roomId: room.value.id, time })
  }

  const syncSeek = (time) => {
    if (!room.value) return
    if (!canControl()) return
    emit('sync-seek', { roomId: room.value.id, time })
  }

  const canControl = () => {
    return isHost.value || allowAllControl.value
  }

  const updatePermission = (allow) => {
    if (!room.value || !isHost.value) return
    emit('update-permission', { roomId: room.value.id, allowAllControl: allow })
  }

  const sendHeartbeat = (currentTime, isPlaying) => {
    if (!room.value || !isHost.value) return
    emit('heartbeat', { roomId: room.value.id, currentTime, isPlaying })
  }

  const requestSync = () => {
    if (!room.value) return
    emit('request-sync', { roomId: room.value.id })
  }

  const sendDanmaku = (danmaku) => {
    if (!room.value) return
    emit('send-danmaku', { roomId: room.value.id, danmaku })
  }

  const setupListeners = () => {
    on('room-created', (data) => {
      room.value = data.room
      isHost.value = true
      members.value = data.room.members
      allowAllControl.value = data.room.allowAllControl || false
    })

    on('room-joined', (data) => {
      room.value = data.room
      isHost.value = data.room.isHost
      members.value = data.room.members
      video.value = data.room.video
      playState.value = data.room.playState
      danmakuHistory.value = data.room.danmakuHistory || []
      allowAllControl.value = data.room.allowAllControl || false
    })

    on('room-error', (data) => {
      alert(data.message)
    })

    on('member-joined', (data) => {
      members.value = data.members
    })

    on('member-left', (data) => {
      members.value = data.members
      if (socket.value?.id === data.newHostId) {
        isHost.value = true
      }
    })

    on('video-selected', (data) => {
      video.value = data.video
    })

    on('sync-state', (data) => {
      video.value = data.video
      playState.value = data.playState
      danmakuHistory.value = data.danmakuHistory || []
      if (data.allowAllControl !== undefined) {
        allowAllControl.value = data.allowAllControl
      }
    })

    on('permission-updated', (data) => {
      allowAllControl.value = data.allowAllControl
    })

    on('new-danmaku', (data) => {
      danmakuHistory.value.push(data.danmaku)
    })
  }

  const resetState = () => {
    room.value = null
    members.value = []
    isHost.value = false
    video.value = null
    playState.value = { isPlaying: false, currentTime: 0 }
    danmakuHistory.value = []
    allowAllControl.value = false
  }

  return {
    room,
    members,
    isHost,
    video,
    playState,
    danmakuHistory,
    allowAllControl,
    canControl,
    createRoom,
    joinRoom,
    leaveRoom,
    selectVideo,
    syncPlay,
    syncPause,
    syncSeek,
    sendHeartbeat,
    requestSync,
    sendDanmaku,
    updatePermission,
    setupListeners,
    resetState
  }
}
