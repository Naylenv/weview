<template>
  <div class="video-player">
    <div ref="playerContainer" class="player-container">
      <div v-if="!video" class="no-video">
        <p>{{ isHost ? '请选择或上传视频' : '等待房主选择视频...' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import DPlayer from 'dplayer'
import { useSocket } from '../composables/useSocket'

const props = defineProps({
  video: Object,
  isHost: Boolean,
  playState: Object
})

const emit = defineEmits(['play', 'pause', 'seek', 'timeupdate'])

const { on, off } = useSocket()
const playerContainer = ref(null)
let dp = null
let ignoreEvents = false

onMounted(() => {
  setupSyncListeners()
})

onUnmounted(() => {
  destroyPlayer()
})

watch(() => props.video, (newVideo) => {
  if (newVideo) {
    nextTick(() => initPlayer(newVideo))
  } else {
    destroyPlayer()
  }
}, { immediate: true })

const initPlayer = (videoData) => {
  destroyPlayer()

  if (!playerContainer.value) return

  // 清空容器
  playerContainer.value.innerHTML = ''

  dp = new DPlayer({
    container: playerContainer.value,
    video: {
      url: videoData.url,
      type: 'auto'
    },
    autoplay: false,
    theme: '#4a9eff'
  })

  // 绑定事件
  dp.on('play', () => {
    if (!ignoreEvents && props.isHost) {
      emit('play')
    }
  })

  dp.on('pause', () => {
    if (!ignoreEvents && props.isHost) {
      emit('pause')
    }
  })

  dp.on('seeked', () => {
    if (!ignoreEvents && props.isHost) {
      emit('seek', dp.video.currentTime)
    }
  })

  dp.on('timeupdate', () => {
    emit('timeupdate', dp.video.currentTime)
  })

  // 如果有初始播放状态，应用它
  if (props.playState) {
    ignoreEvents = true
    dp.seek(props.playState.currentTime)
    if (props.playState.isPlaying) {
      dp.play()
    }
    setTimeout(() => { ignoreEvents = false }, 500)
  }
}

const destroyPlayer = () => {
  if (dp) {
    dp.destroy()
    dp = null
  }
}

const setupSyncListeners = () => {
  on('sync-play', ({ time }) => {
    if (dp && !props.isHost) {
      ignoreEvents = true
      dp.seek(time)
      dp.play()
      setTimeout(() => { ignoreEvents = false }, 500)
    }
  })

  on('sync-pause', ({ time }) => {
    if (dp && !props.isHost) {
      ignoreEvents = true
      dp.seek(time)
      dp.pause()
      setTimeout(() => { ignoreEvents = false }, 500)
    }
  })

  on('sync-seek', ({ time }) => {
    if (dp && !props.isHost) {
      ignoreEvents = true
      dp.seek(time)
      setTimeout(() => { ignoreEvents = false }, 500)
    }
  })

  // 弹幕通过 CSS 动画实现，不依赖 DPlayer 的弹幕功能
  on('new-danmaku', ({ danmaku }) => {
    drawDanmaku(danmaku)
  })
}

// 自定义弹幕绘制
const drawDanmaku = (danmaku) => {
  if (!playerContainer.value) return

  const container = playerContainer.value
  const el = document.createElement('div')
  el.className = 'custom-danmaku'
  el.textContent = danmaku.text
  el.style.color = danmaku.color || '#fff'
  el.style.top = Math.random() * 80 + '%'

  container.appendChild(el)

  // 动画结束后移除
  setTimeout(() => {
    el.remove()
  }, 8000)
}

const getState = () => {
  if (!dp) return { currentTime: 0, isPlaying: false }
  return {
    currentTime: dp.video.currentTime,
    isPlaying: !dp.video.paused
  }
}

const sendDanmaku = (danmaku) => {
  drawDanmaku(danmaku)
}

defineExpose({ getState, sendDanmaku })
</script>

<style scoped>
.video-player {
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
}

.no-video {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: #888;
}

:deep(.dplayer) {
  width: 100%;
  height: 100%;
}

.custom-danmaku {
  position: absolute;
  right: -100%;
  white-space: nowrap;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: danmaku-scroll 8s linear forwards;
  pointer-events: none;
  z-index: 10;
}

@keyframes danmaku-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 100vw));
  }
}
</style>
