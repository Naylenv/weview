<template>
  <div class="home">
    <div class="spotlight"></div>
    <div class="container">
      <header class="hero">
        <div class="logo-mark">
          <svg viewBox="0 0 48 48" fill="none" class="film-icon">
            <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" stroke-width="2" />
            <circle cx="12" cy="14" r="2" fill="currentColor" />
            <circle cx="12" cy="22" r="2" fill="currentColor" />
            <circle cx="12" cy="30" r="2" fill="currentColor" />
            <circle cx="36" cy="14" r="2" fill="currentColor" />
            <circle cx="36" cy="22" r="2" fill="currentColor" />
            <circle cx="36" cy="30" r="2" fill="currentColor" />
            <rect x="18" y="16" width="12" height="16" rx="1" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>
        <h1 class="title">WeView</h1>
        <p class="tagline">与朋友同步观影，共享每一个精彩瞬间</p>
      </header>

      <div class="card">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="input-group">
            <label for="nickname">
              <span class="label-text">你的昵称</span>
              <span class="label-hint">在房间中显示的名字</span>
            </label>
            <div class="input-wrapper">
              <input
                id="nickname"
                v-model="nickname"
                type="text"
                placeholder="输入昵称"
                maxlength="20"
                autocomplete="off"
              />
              <div class="input-border"></div>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-primary" @click="handleCreateRoom" :disabled="!nickname">
              <span class="btn-content">
                <svg viewBox="0 0 24 24" fill="none" class="btn-icon">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                创建房间
              </span>
              <div class="btn-shine"></div>
            </button>

            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">或加入已有房间</span>
              <span class="divider-line"></span>
            </div>

            <div class="join-section">
              <div class="input-wrapper join-input">
                <input
                  v-model="roomId"
                  type="text"
                  placeholder="房间号"
                  maxlength="8"
                  autocomplete="off"
                />
                <div class="input-border"></div>
              </div>
              <button class="btn btn-secondary" @click="handleJoinRoom" :disabled="!nickname || !roomId">
                加入
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">
        <p>实时同步播放 · 弹幕互动 · 私密房间</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSocket } from "../composables/useSocket";
import { useRoom } from "../composables/useRoom";

const router = useRouter();
const { connect, socket } = useSocket();
const { createRoom, joinRoom, setupListeners } = useRoom();

const nickname = ref("");
const roomId = ref("");

onMounted(() => {
  const s = connect();
  setupListeners();

  s.on("room-created", (data) => {
    router.push(`/room/${data.roomId}`);
  });

  s.on("room-joined", (data) => {
    router.push(`/room/${data.roomId}`);
  });
});

const handleCreateRoom = () => {
  if (nickname.value.trim()) {
    createRoom(nickname.value.trim());
  }
};

const handleJoinRoom = () => {
  if (nickname.value.trim() && roomId.value.trim()) {
    joinRoom(roomId.value.trim(), nickname.value.trim());
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.spotlight {
  position: absolute;
  top: -30%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(
    ellipse at center,
    rgba(212, 168, 83, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-50%) scale(1.1);
  }
}

.container {
  text-align: center;
  max-width: 420px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero {
  margin-bottom: 48px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-mark {
  margin-bottom: 24px;
}

.film-icon {
  width: 64px;
  height: 64px;
  color: var(--color-gold);
  filter: drop-shadow(0 0 20px rgba(212, 168, 83, 0.3));
}

.title {
  font-family: var(--font-display);
  font-size: 2.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  background: linear-gradient(
    135deg,
    var(--color-text-primary) 0%,
    var(--color-gold) 50%,
    var(--color-text-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

.tagline {
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.card {
  position: relative;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.card-glow {
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    135deg,
    rgba(212, 168, 83, 0.2) 0%,
    transparent 50%,
    rgba(212, 168, 83, 0.1) 100%
  );
  border-radius: calc(var(--radius-lg) + 1px);
  opacity: 0;
  transition: opacity var(--transition-smooth);
}

.card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  backdrop-filter: blur(20px);
}

.input-group {
  margin-bottom: 28px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 10px;
}

.label-text {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.label-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  outline: none;
  transition: background var(--transition-fast);
}

.input-wrapper input:hover {
  background: var(--color-bg-hover);
}

.input-wrapper input:focus {
  background: var(--color-bg-hover);
}

.input-border {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  pointer-events: none;
  transition: border-color var(--transition-fast);
}

.input-wrapper input:focus + .input-border {
  border-color: var(--color-gold-dim);
}

.input-wrapper input::placeholder {
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn {
  position: relative;
  padding: 16px 28px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%);
  color: var(--color-bg-deep);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 168, 83, 0.25);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-primary:hover:not(:disabled) .btn-shine {
  left: 100%;
}

.btn-secondary {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 14px 24px;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg-hover);
  border-color: var(--color-border-hover);
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider-text {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  white-space: nowrap;
}

.join-section {
  display: flex;
  gap: 12px;
}

.join-input {
  flex: 1;
}

.join-input input {
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer {
  margin-top: 40px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.footer p {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
}
</style>
