<template>
  <div class="room">
    <header class="header">
      <div class="header-left">
        <div class="room-badge">
          <svg viewBox="0 0 24 24" fill="none" class="room-icon">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
            <circle cx="7" cy="9" r="1" fill="currentColor" />
            <circle cx="7" cy="14" r="1" fill="currentColor" />
            <circle cx="17" cy="9" r="1" fill="currentColor" />
            <circle cx="17" cy="14" r="1" fill="currentColor" />
          </svg>
          <span class="room-id">{{ roomId }}</span>
        </div>
        <span class="host-badge" v-if="isHost">
          <svg viewBox="0 0 16 16" fill="none" class="crown-icon">
            <path d="M8 2L10 6L14 5L12 10H4L2 5L6 6L8 2Z" fill="currentColor" />
            <rect x="4" y="11" width="8" height="2" rx="0.5" fill="currentColor" />
          </svg>
          房主
        </span>
      </div>
      <div class="header-actions">
        <button class="btn-header" @click="copyRoomLink" title="复制房间链接">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M5 15V6a2 2 0 012-2h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <button class="btn-header btn-leave" @click="handleLeave" title="离开房间">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </header>

    <div class="main-content">
      <div class="video-section">
        <div class="video-player">
          <div class="player-frame">
            <div class="player-container">
              <div v-if="!video" class="no-video">
                <div class="no-video-content">
                  <svg viewBox="0 0 64 64" fill="none" class="no-video-icon">
                    <rect x="8" y="14" width="48" height="36" rx="4" stroke="currentColor" stroke-width="2" />
                    <path d="M28 26v12l10-6-10-6z" fill="currentColor" />
                  </svg>
                  <p>{{ isHost ? "选择或上传视频开始观影" : "等待房主选择视频..." }}</p>
                </div>
              </div>
              <div v-else ref="playerContainer" class="dplayer-wrap"></div>
              <DanmakuLayer ref="danmakuLayerRef" :paused="isPaused" />
              <div v-if="video" class="player-overlay-buttons">
                <button class="overlay-btn" @click="handleLocalToggle" :title="isPaused ? '本地播放' : '本地暂停'">
                  <svg v-if="isPaused" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                  </svg>
                </button>
                <button class="overlay-btn" @click="handleSync" title="同步">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 12a8 8 0 018-8v3l4-4-4-4v3a10 10 0 100 20 10 10 0 006.32-2.26l-1.46-1.46A8 8 0 014 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <ControlPanel
          v-if="video && canControl()"
          :currentTime="currentTime"
          :duration="duration"
          :isPlaying="!isPaused"
          :isHost="isHost"
          :canControl="canControl()"
          :allowAllControl="allowAllControl"
          @play="handleControlPlay"
          @pause="handleControlPause"
          @seek="handleControlSeek"
          @update-permission="handleUpdatePermission"
          @sync="handleSync"
        />
        <DanmakuInput @send="handleSendDanmaku" />
      </div>

      <aside class="sidebar">
        <div class="panel members-panel">
          <div class="panel-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" class="panel-icon">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              在线成员
            </h3>
            <span class="count-badge">{{ members.length }}</span>
          </div>
          <ul class="member-list">
            <li v-for="member in members" :key="member.id" class="member-item">
              <div class="member-avatar">{{ member.name.charAt(0).toUpperCase() }}</div>
              <span class="member-name">{{ member.name }}</span>
              <span v-if="member.isHost" class="host-tag">
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 4L11 3.5L9 7H3L1 3.5L4.5 4L6 1Z" fill="currentColor" />
                </svg>
              </span>
            </li>
          </ul>
        </div>

        <div class="panel video-panel" v-if="isHost">
          <div class="panel-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" class="panel-icon">
                <path d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l1-2h14l1 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9 10l3 2-3 2v-4z" fill="currentColor" />
              </svg>
              视频库
            </h3>
            <span class="count-badge">{{ videoList.length }} 部</span>
          </div>

          <input
            type="file"
            ref="fileInput"
            accept="video/*"
            @change="handleFileSelect"
            style="display: none"
          />

          <div class="video-list" v-if="videoList.length > 0">
            <div
              v-for="v in videoList"
              :key="v.id"
              class="video-item"
              :class="{ active: video?.id === v.id, playing: video?.id === v.id }"
              @click="handleSelectVideo(v)"
            >
              <div class="video-poster">
                <svg viewBox="0 0 24 24" fill="none" class="poster-icon">
                  <path d="M9.5 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
                </svg>
                <div class="playing-indicator" v-if="video?.id === v.id">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div class="video-details">
                <span class="video-title" :title="v.name">{{ v.name }}</span>
                <span class="video-meta-info">{{ formatSize(v.size) }}</span>
              </div>
              <button class="btn-remove" @click.stop="handleDeleteVideo(v)" title="删除">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="empty-library" v-else>
            <div class="empty-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" stroke-width="1.5" />
                <path d="M20 19v10l8-5-8-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
            <p class="empty-text">还没有视频</p>
            <p class="empty-hint">上传视频开始观影之旅</p>
          </div>

          <button class="btn-add-video" @click="triggerFileInput" :disabled="uploading">
            <template v-if="uploading">
              <div class="upload-ring">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="50 14" />
                </svg>
              </div>
              <span>上传中 {{ uploadProgress }}%</span>
            </template>
            <template v-else>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>添加视频</span>
            </template>
          </button>
        </div>

        <ChatBox :messages="danmakuHistory" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import DPlayer from "dplayer";
import { useSocket } from "../composables/useSocket";
import { useRoom } from "../composables/useRoom";
import DanmakuInput from "../components/DanmakuInput.vue";
import DanmakuLayer from "../components/DanmakuLayer.vue";
import ChatBox from "../components/ChatBox.vue";
import ControlPanel from "../components/ControlPanel.vue";

const router = useRouter();
const route = useRoute();
const roomId = route.params.id;

const { connect, on } = useSocket();
const {
  room,
  members,
  isHost,
  video,
  playState,
  danmakuHistory,
  allowAllControl,
  canControl,
  selectVideo,
  syncPlay,
  syncPause,
  syncSeek,
  sendHeartbeat,
  sendDanmaku,
  leaveRoom,
  updatePermission,
  requestSync,
  setupListeners,
} = useRoom();

const playerContainer = ref(null);
const danmakuLayerRef = ref(null);
const fileInput = ref(null);
const videoList = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const isPaused = ref(true);
const currentTime = ref(0);
const duration = ref(0);

let dp = null;
let heartbeatInterval = null;

onMounted(async () => {
  connect();
  setupListeners();
  await fetchVideoList();
  setupSyncListeners();

  if (isHost.value) {
    startHeartbeat();
  }
});

onUnmounted(() => {
  stopHeartbeat();
  if (dp) {
    dp.destroy();
    dp = null;
  }
});

watch(isHost, (newVal) => {
  if (newVal) {
    startHeartbeat();
  } else {
    stopHeartbeat();
  }
});

watch(video, (newVideo) => {
  if (newVideo) {
    nextTick(() => initPlayer(newVideo));
  }
});

const initPlayer = (videoData) => {
  if (dp) {
    dp.destroy();
    dp = null;
  }

  if (!playerContainer.value) return;

  dp = new DPlayer({
    container: playerContainer.value,
    video: {
      url: videoData.url,
      type: "auto",
    },
    autoplay: false,
    theme: "#d4a853",
    hotkey: false,
    contextmenu: [],
  });

  dp.on("play", () => {
    isPaused.value = false;
  });

  dp.on("pause", () => {
    isPaused.value = true;
  });

  dp.on("timeupdate", () => {
    if (dp) {
      currentTime.value = dp.video.currentTime;
    }
  });

  dp.on("loadedmetadata", () => {
    if (dp) {
      duration.value = dp.video.duration;
    }
  });
};

const setupSyncListeners = () => {
  on("sync-play", ({ time }) => {
    if (dp) {
      dp.seek(time);
      dp.play();
    }
  });

  on("sync-pause", ({ time }) => {
    if (dp) {
      dp.seek(time);
      dp.pause();
    }
  });

  on("sync-seek", ({ time }) => {
    if (dp) {
      dp.seek(time);
    }
  });

  on("sync-state", ({ playState }) => {
    if (dp && playState) {
      dp.seek(playState.currentTime);
      if (playState.isPlaying) {
        dp.play();
      } else {
        dp.pause();
      }
    }
  });
};

const startHeartbeat = () => {
  heartbeatInterval = setInterval(() => {
    if (dp) {
      sendHeartbeat(dp.video.currentTime, !dp.video.paused);
    }
  }, 5000);
};

const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

const fetchVideoList = async () => {
  try {
    const res = await fetch("/api/videos");
    const data = await res.json();
    videoList.value = data.videos;
  } catch (e) {
    console.error("获取视频列表失败:", e);
  }
};

const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  uploading.value = true;
  uploadProgress.value = 0;

  const formData = new FormData();
  formData.append("video", file);

  try {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        uploadProgress.value = Math.round((e.loaded / e.total) * 100);
      }
    };

    await new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("上传失败"));
        }
      };
      xhr.onerror = reject;
      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    });

    await fetchVideoList();
  } catch (e) {
    alert("上传失败: " + e.message);
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const handleSelectVideo = (v) => {
  selectVideo(v);
};

const handleDeleteVideo = async (v) => {
  if (!confirm(`确定要删除 "${v.name}" 吗？`)) return;

  try {
    const res = await fetch(`/api/videos/${v.id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchVideoList();
      if (video.value?.id === v.id) {
        video.value = null;
        if (dp) {
          dp.destroy();
          dp = null;
        }
      }
    } else {
      alert("删除失败");
    }
  } catch (e) {
    alert("删除失败: " + e.message);
  }
};

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
};

const handleSendDanmaku = (danmaku) => {
  sendDanmaku(danmaku);
};

const handleControlPlay = (time) => {
  syncPlay(time);
};

const handleControlPause = (time) => {
  syncPause(time);
};

const handleControlSeek = (time) => {
  syncSeek(time);
};

const handleUpdatePermission = (allow) => {
  updatePermission(allow);
};

const handleSync = () => {
  requestSync();
};

const handleLocalToggle = () => {
  if (dp) {
    if (dp.video.paused) {
      dp.play();
    } else {
      dp.pause();
    }
  }
};

const copyRoomLink = () => {
  const link = window.location.href;
  navigator.clipboard.writeText(link);
  alert("房间链接已复制");
};

const handleLeave = () => {
  leaveRoom();
  router.push("/");
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
};
</script>

<style scoped>
.room {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.room-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.room-icon {
  width: 20px;
  height: 20px;
  color: var(--color-gold);
}

.room-id {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
}

.host-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-bg-deep);
}

.crown-icon {
  width: 14px;
  height: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-header svg {
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.btn-header:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-hover);
}

.btn-header:hover svg {
  color: var(--color-text-primary);
}

.btn-leave:hover {
  border-color: #e74c3c;
}

.btn-leave:hover svg {
  color: #e74c3c;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
}

.video-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.video-player {
  width: 100%;
}

.player-frame {
  background: var(--color-bg-deep);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-elevated), 0 0 60px rgba(0, 0, 0, 0.5);
}

.player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  background: #000;
}

.player-overlay-buttons {
  position: absolute;
  bottom: 60px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.player-container:hover .player-overlay-buttons {
  opacity: 1;
}

.overlay-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: rgba(255, 255, 255, 0.8);
}

.overlay-btn:hover {
  background: rgba(212, 168, 83, 0.8);
  border-color: var(--color-gold);
  color: var(--color-bg-deep);
  transform: scale(1.1);
}

.overlay-btn svg {
  width: 22px;
  height: 22px;
}

.no-video {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(10, 10, 12, 0.9) 0%, rgba(10, 10, 12, 1) 100%);
}

.no-video-content {
  text-align: center;
}

.no-video-icon {
  width: 80px;
  height: 80px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-video p {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

.dplayer-wrap {
  width: 100%;
  height: 100%;
}

:deep(.dplayer) {
  width: 100%;
  height: 100%;
}

:deep(.dplayer-controller) {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  pointer-events: none;
}

:deep(.dplayer-controller .dplayer-icons) {
  pointer-events: auto;
}

:deep(.dplayer-controller .dplayer-icons-right) {
  pointer-events: auto;
}

:deep(.dplayer-bar-wrap) {
  pointer-events: none;
}

:deep(.dplayer-controller .dplayer-play-icon) {
  pointer-events: none;
}

.sidebar {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.panel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
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

.member-list {
  list-style: none;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}

.member-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.member-item:first-child {
  padding-top: 0;
}

.member-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gold);
}

.member-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.host-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--color-gold);
}

.host-tag svg {
  width: 14px;
  height: 14px;
}

.video-panel {
  display: flex;
  flex-direction: column;
}

.video-list {
  flex: 1;
  max-height: 240px;
  overflow-y: auto;
  margin: 0 -8px;
  padding: 0 8px;
}

.video-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.video-item:last-child {
  margin-bottom: 0;
}

.video-item:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
}

.video-item.active {
  border-color: var(--color-gold-dim);
  background: var(--color-gold-glow);
}

.video-poster {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-deep);
  border-radius: var(--radius-sm);
  position: relative;
  flex-shrink: 0;
}

.poster-icon {
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.video-item.active .poster-icon {
  color: var(--color-gold);
}

.video-item:hover .poster-icon {
  color: var(--color-text-secondary);
}

.playing-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 10px;
}

.playing-indicator span {
  width: 3px;
  background: var(--color-gold);
  border-radius: 1px;
  animation: equalizer 0.8s ease-in-out infinite;
}

.playing-indicator span:nth-child(1) {
  height: 4px;
  animation-delay: 0s;
}

.playing-indicator span:nth-child(2) {
  height: 8px;
  animation-delay: 0.2s;
}

.playing-indicator span:nth-child(3) {
  height: 6px;
  animation-delay: 0.4s;
}

@keyframes equalizer {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

.video-details {
  flex: 1;
  min-width: 0;
}

.video-title {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.video-meta-info {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.btn-remove {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.btn-remove svg {
  width: 14px;
  height: 14px;
  color: var(--color-text-muted);
}

.video-item:hover .btn-remove {
  opacity: 1;
}

.btn-remove:hover {
  background: rgba(231, 76, 60, 0.15);
}

.btn-remove:hover svg {
  color: #e74c3c;
}

.empty-library {
  text-align: center;
  padding: 32px 20px;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-icon svg {
  width: 56px;
  height: 56px;
  color: var(--color-text-muted);
  opacity: 0.4;
}

.empty-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.btn-add-video {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  margin-top: 16px;
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

.btn-add-video svg {
  width: 18px;
  height: 18px;
}

.btn-add-video:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(212, 168, 83, 0.3);
}

.btn-add-video:active:not(:disabled) {
  transform: translateY(0);
}

.btn-add-video:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.upload-ring {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

.upload-ring svg {
  width: 100%;
  height: 100%;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>
