<template>
  <div class="danmaku-container" ref="containerRef">
    <div
      v-for="item in activeDanmakus"
      :key="item.id"
      class="danmaku-item"
      :style="getDanmakuStyle(item)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSocket } from '../composables/useSocket'

const props = defineProps({
  paused: {
    type: Boolean,
    default: false
  }
})

const { on } = useSocket()
const containerRef = ref(null)
const activeDanmakus = ref([])

// 弹幕轨道管理
const TRACK_COUNT = 12
const trackEndTimes = ref(new Array(TRACK_COUNT).fill(0))

// 弹幕配置
const DANMAKU_SPEED = 8000 // 弹幕滚动时间 (ms)
const DANMAKU_GAP = 100 // 弹幕之间的最小间隔 (px)

let animationId = null
let lastTime = 0

onMounted(() => {
  setupDanmakuListener()
  startAnimation()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

const setupDanmakuListener = () => {
  on('new-danmaku', ({ danmaku }) => {
    addDanmaku(danmaku)
  })
}

const addDanmaku = (danmaku) => {
  if (!containerRef.value) return

  const containerWidth = containerRef.value.offsetWidth
  const now = Date.now()

  // 计算弹幕宽度 (估算)
  const textWidth = danmaku.text.length * 24 + 20

  // 找到可用的轨道
  let trackIndex = -1
  for (let i = 0; i < TRACK_COUNT; i++) {
    if (trackEndTimes.value[i] <= now) {
      trackIndex = i
      break
    }
  }

  // 如果没有空闲轨道，使用最早结束的轨道
  if (trackIndex === -1) {
    let minTime = Infinity
    for (let i = 0; i < TRACK_COUNT; i++) {
      if (trackEndTimes.value[i] < minTime) {
        minTime = trackEndTimes.value[i]
        trackIndex = i
      }
    }
  }

  // 计算这个轨道的结束时间
  const travelTime = DANMAKU_SPEED
  const gapTime = (DANMAKU_GAP / (containerWidth + textWidth)) * travelTime
  trackEndTimes.value[trackIndex] = now + gapTime + (textWidth / (containerWidth + textWidth)) * travelTime

  const newDanmaku = {
    id: danmaku.id || Date.now() + Math.random(),
    text: danmaku.text,
    color: danmaku.color || '#ffffff',
    track: trackIndex,
    startTime: now,
    duration: DANMAKU_SPEED,
    width: textWidth
  }

  activeDanmakus.value.push(newDanmaku)

  // 弹幕结束后移除
  setTimeout(() => {
    const index = activeDanmakus.value.findIndex(d => d.id === newDanmaku.id)
    if (index !== -1) {
      activeDanmakus.value.splice(index, 1)
    }
  }, DANMAKU_SPEED + 100)
}

const getDanmakuStyle = (item) => {
  if (!containerRef.value) return {}

  const containerWidth = containerRef.value.offsetWidth
  const containerHeight = containerRef.value.offsetHeight
  const trackHeight = containerHeight / TRACK_COUNT

  const elapsed = Date.now() - item.startTime
  const progress = Math.min(elapsed / item.duration, 1)

  // 从右边开始，移动到左边消失
  const startX = containerWidth
  const endX = -item.width
  const currentX = startX + (endX - startX) * progress

  return {
    color: item.color,
    top: `${item.track * trackHeight + 5}px`,
    transform: `translateX(${currentX}px)`,
    textShadow: `
      1px 1px 2px rgba(0,0,0,0.8),
      -1px -1px 2px rgba(0,0,0,0.8),
      1px -1px 2px rgba(0,0,0,0.8),
      -1px 1px 2px rgba(0,0,0,0.8)
    `
  }
}

const startAnimation = () => {
  const animate = (time) => {
    if (!props.paused) {
      // 强制更新样式
      activeDanmakus.value = [...activeDanmakus.value]
    }
    animationId = requestAnimationFrame(animate)
  }
  animationId = requestAnimationFrame(animate)
}

// 暴露方法供外部调用
const sendDanmaku = (danmaku) => {
  addDanmaku(danmaku)
}

defineExpose({ sendDanmaku })
</script>

<style scoped>
.danmaku-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-size: 22px;
  font-weight: bold;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  line-height: 1.2;
  pointer-events: none;
  will-change: transform;
}
</style>
