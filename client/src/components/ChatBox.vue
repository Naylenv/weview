<template>
  <div class="chat-box panel">
    <div class="panel-header">
      <h3>
        <svg viewBox="0 0 24 24" fill="none" class="panel-icon">
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        弹幕记录
      </h3>
      <span class="count-badge">{{ messages.length }}</span>
    </div>
    <div class="messages" ref="messagesRef">
      <div v-for="msg in messages" :key="msg.id" class="message">
        <div class="message-header">
          <span class="sender">{{ msg.sender }}</span>
          <span class="time">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div class="message-content" :style="{ color: msg.color || 'var(--color-text-primary)' }">
          {{ msg.text }}
        </div>
      </div>
      <div v-if="messages.length === 0" class="empty-state">
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M38 22a14.5 14.5 0 01-1.5 6.5A14.5 14.5 0 0124 38a14.5 14.5 0 01-6.5-1.5L8 40l3.5-9.5A14.5 14.5 0 0110 24a14.5 14.5 0 018-13A14.5 14.5 0 0124 10h1a14.4 14.4 0 0113 13v1z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>发送弹幕开始互动</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});

const messagesRef = ref(null);

watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
      }
    });
  }
);

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
};
</script>

<style scoped>
.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.panel-icon {
  width: 18px;
  height: 18px;
  color: var(--color-gold);
}

.count-badge {
  padding: 4px 10px;
  background: var(--color-bg-elevated);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.messages {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
  margin: 0 -8px;
  padding: 0 8px;
}

.message {
  padding: 12px 14px;
  border-radius: var(--radius-md);
  margin-bottom: 8px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  transition: border-color var(--transition-fast);
}

.message:hover {
  border-color: var(--color-border-hover);
}

.message:last-child {
  margin-bottom: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.sender {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gold);
}

.time {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.message-content {
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--color-text-muted);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.4;
}

.empty-state p {
  font-size: 0.8125rem;
}
</style>
