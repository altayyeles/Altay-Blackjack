// Background music controller
// Usage: place your mp3 at assets/audio/background.mp3 (or update MUSIC_SRC)

const MUSIC_SRC = "assets/audio/background.mp3"; // change if needed
const TOGGLE_ID = "music-toggle";
const STORAGE_KEY = "bg-music-enabled";

let audioEl;
let enabled = false;

const ensureAudio = () => {
  if (!audioEl) {
    audioEl = new Audio(MUSIC_SRC);
    audioEl.loop = true;
    audioEl.volume = 0.5; // default volume
  }
};

const setIcon = () => {
  const btn = document.getElementById(TOGGLE_ID);
  if (!btn) return;
  if (enabled) {
    btn.classList.remove("fa-volume-xmark");
    btn.classList.add("fa-volume-high");
  } else {
    btn.classList.remove("fa-volume-high");
    btn.classList.add("fa-volume-xmark");
  }
};

const loadState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  enabled = saved === null ? false : saved === "true";
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, String(enabled));
};

const play = () => {
  ensureAudio();
  audioEl.play().catch(() => {
    // Autoplay can be blocked; wait for user gesture via toggle
  });
};

const pause = () => {
  if (audioEl) audioEl.pause();
};

const toggle = () => {
  enabled = !enabled;
  saveState();
  setIcon();
  if (enabled) play();
  else pause();
};

// init
window.addEventListener("load", () => {
  loadState();
  setIcon();
  if (enabled) play();
  const btn = document.getElementById(TOGGLE_ID);
  if (btn) btn.addEventListener("click", toggle);
});

export {}; // as module
