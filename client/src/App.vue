<template>
  <div id="app">
    <div class="grain-overlay"></div>
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --color-bg-deep: #0a0a0c;
  --color-bg-surface: #121215;
  --color-bg-elevated: #1a1a1f;
  --color-bg-hover: #222228;
  --color-gold: #d4a853;
  --color-gold-dim: #a68532;
  --color-gold-glow: rgba(212, 168, 83, 0.15);
  --color-amber: #e8b04b;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #8a8a8f;
  --color-text-muted: #5a5a5f;
  --color-border: rgba(255, 255, 255, 0.06);
  --color-border-hover: rgba(255, 255, 255, 0.12);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-glow: 0 0 40px rgba(212, 168, 83, 0.08);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.4);
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background: var(--color-bg-deep);
  min-height: 100vh;
  color: var(--color-text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 168, 83, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(212, 168, 83, 0.03) 0%, transparent 40%),
    var(--color-bg-deep);
}

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

::selection {
  background: var(--color-gold);
  color: var(--color-bg-deep);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--color-bg-hover);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
</style>
