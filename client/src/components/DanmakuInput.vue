<template>
  <div class="danmaku-input">
    <div class="color-picker">
      <button
        v-for="c in colors"
        :key="c.value"
        class="color-btn"
        :class="{ active: color === c.value }"
        :style="{ '--color': c.value }"
        @click="color = c.value"
        :title="c.name"
      >
        <span class="color-dot"></span>
      </button>
    </div>
    <div class="input-wrapper">
      <input
        v-model="text"
        type="text"
        placeholder="发送弹幕..."
        maxlength="100"
        @keyup.enter="send"
      />
      <div class="input-border"></div>
    </div>
    <button class="send-btn" @click="send" :disabled="!text.trim()">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>发送</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["send"]);

const text = ref("");
const color = ref("#f5f5f5");
const colors = [
  { value: "#f5f5f5", name: "白色" },
  { value: "#ff6b6b", name: "红色" },
  { value: "#ffd93d", name: "黄色" },
  { value: "#6bcb77", name: "绿色" },
  { value: "#4d96ff", name: "蓝色" },
  { value: "#d4a853", name: "金色" },
];

const send = () => {
  if (!text.value.trim()) return;

  emit("send", {
    text: text.value.trim(),
    color: color.value,
    type: "right",
    time: Date.now(),
  });

  text.value = "";
};
</script>

<style scoped>
.danmaku-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.color-picker {
  display: flex;
  gap: 6px;
}

.color-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-btn:hover {
  border-color: var(--color-border-hover);
  transform: scale(1.1);
}

.color-btn.active {
  border-color: var(--color);
  box-shadow: 0 0 0 2px var(--color-bg-surface), 0 0 0 3px var(--color);
}

.color-dot {
  width: 14px;
  height: 14px;
  background: var(--color);
  border-radius: 50%;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
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

.send-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-deep);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.send-btn svg {
  width: 16px;
  height: 16px;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 168, 83, 0.3);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .danmaku-input {
    flex-wrap: wrap;
  }

  .color-picker {
    order: 2;
    width: 100%;
    justify-content: center;
    padding-top: 12px;
    border-top: 1px solid var(--color-border);
    margin-top: 4px;
  }

  .input-wrapper {
    flex: 1;
    min-width: 0;
  }

  .send-btn span {
    display: none;
  }

  .send-btn {
    padding: 12px 14px;
  }
}
</style>
