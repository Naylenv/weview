<template>
  <div class="control-panel">
    <div class="control-main">
      <div class="control-buttons">
        <button class="btn-control btn-skip" @click="seek(-30)" title="后退 30 秒" :disabled="!canControl">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/>
            <text x="12" y="15" text-anchor="middle" font-size="6" fill="currentColor">30</text>
          </svg>
        </button>
        <button class="btn-control btn-skip" @click="seek(-10)" title="后退 10 秒" :disabled="!canControl">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/>
            <text x="12" y="15" text-anchor="middle" font-size="6" fill="currentColor">10</text>
          </svg>
        </button>
        <button class="btn-control btn-play" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'" :disabled="!canControl">
          <svg v-if="isPlaying" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
          </svg>
        </button>
        <button class="btn-control btn-skip" @click="seek(10)" title="快进 10 秒" :disabled="!canControl">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" fill="currentColor"/>
            <text x="12" y="15" text-anchor="middle" font-size="6" fill="currentColor">10</text>
          </svg>
        </button>
        <button class="btn-control btn-skip" @click="seek(30)" title="快进 30 秒" :disabled="!canControl">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" fill="currentColor"/>
            <text x="12" y="15" text-anchor="middle" font-size="6" fill="currentColor">30</text>
          </svg>
        </button>
      </div>
      <div class="progress-section">
        <span class="time-display">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar-wrap" :class="{ disabled: !canControl }" @click="canControl && onProgressClick($event)" ref="progressBarRef">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <input
            v-if="canControl"
            type="range"
            class="progress-input"
            :value="currentTime"
            :max="duration"
            min="0"
            step="0.1"
            @input="onSeekInput"
            @change="onSeekChange"
          />
        </div>
        <span class="time-display">{{ formatTime(duration) }}</span>
      </div>
    </div>
    <div class="permission-toggle" v-if="isHost">
      <label class="toggle-label">
        <input type="checkbox" :checked="allowAllControl" @change="onPermissionChange" />
        <span class="toggle-switch"></span>
        <span class="toggle-text">允许所有人控制</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  currentTime: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  isPlaying: { type: Boolean, default: false },
  isHost: { type: Boolean, default: false },
  canControl: { type: Boolean, default: false },
  allowAllControl: { type: Boolean, default: false }
})

const emit = defineEmits(['play', 'pause', 'seek', 'update-permission'])

const progressBarRef = ref(null)
const isSeeking = ref(false)
const seekTime = ref(0)

const progressPercent = computed(() => {
  if (!props.duration) return 0
  return (props.currentTime / props.duration) * 100
})

const togglePlay = () => {
  if (!props.canControl) return
  if (props.isPlaying) {
    emit('pause', props.currentTime)
  } else {
    emit('play', props.currentTime)
  }
}

const seek = (delta) => {
  if (!props.canControl) return
  const newTime = Math.max(0, Math.min(props.duration, props.currentTime + delta))
  emit('seek', newTime)
}

const onSeekInput = (e) => {
  isSeeking.value = true
  seekTime.value = parseFloat(e.target.value)
}

const onSeekChange = (e) => {
  const time = parseFloat(e.target.value)
  emit('seek', time)
  isSeeking.value = false
}

const onProgressClick = (e) => {
  if (!props.canControl) return
  if (!progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const time = percent * props.duration
  emit('seek', Math.max(0, Math.min(props.duration, time)))
}

const onPermissionChange = (e) => {
  emit('update-permission', e.target.checked)
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.control-panel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
}

.control-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-control {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.btn-control:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

.btn-skip {
  width: 40px;
  height: 40px;
}

.btn-skip svg {
  width: 22px;
  height: 22px;
}

.btn-play {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%);
  border-color: var(--color-gold);
  color: var(--color-bg-deep);
}

.btn-play:hover {
  background: linear-gradient(135deg, var(--color-gold-dim) 0%, var(--color-gold) 100%);
  border-color: var(--color-gold);
  color: var(--color-bg-deep);
  transform: scale(1.05);
}

.btn-play svg {
  width: 26px;
  height: 26px;
}

.btn-control:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-control:disabled:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
  transform: none;
}

.btn-play:disabled {
  background: var(--color-bg-elevated);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-display {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-muted);
  min-width: 40px;
  text-align: center;
}

.progress-bar-wrap {
  flex: 1;
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-bar-wrap.disabled {
  cursor: default;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--color-bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-dim) 100%);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

.permission-toggle {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-label input {
  display: none;
}

.toggle-switch {
  width: 36px;
  height: 20px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: relative;
  transition: all var(--transition-fast);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background: var(--color-text-muted);
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all var(--transition-fast);
}

.toggle-label input:checked + .toggle-switch {
  background: var(--color-gold-glow);
  border-color: var(--color-gold-dim);
}

.toggle-label input:checked + .toggle-switch::after {
  background: var(--color-gold);
  left: 18px;
}

.toggle-text {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
</style>
