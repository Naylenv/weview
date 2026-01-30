import { ref, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const connected = ref(false)

export function useSocket() {
  const connect = () => {
    if (socket.value?.connected) return socket.value

    const serverUrl = import.meta.env.PROD ? '' : 'http://localhost:3000'
    socket.value = io(serverUrl, {
      transports: ['websocket', 'polling']
    })

    socket.value.on('connect', () => {
      connected.value = true
      console.log('Socket 已连接')
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Socket 已断开')
    })

    return socket.value
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  const emit = (event, data) => {
    if (socket.value) {
      socket.value.emit(event, data)
    }
  }

  const on = (event, callback) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socket.value) {
      socket.value.off(event, callback)
    }
  }

  return {
    socket,
    connected,
    connect,
    disconnect,
    emit,
    on,
    off
  }
}
