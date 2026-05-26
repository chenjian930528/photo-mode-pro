const modes = Array.isArray(window.PHOTO_MODES) ? window.PHOTO_MODES : [];

const grid = document.querySelector("#modeGrid");
const sheet = document.querySelector("#modeSheet");
const closeSheet = document.querySelector("#closeSheet");
const sheetIcon = document.querySelector("#sheetIcon");
const sheetKicker = document.querySelector("#sheetKicker");
const sheetTitle = document.querySelector("#sheetTitle");
const sheetCopy = document.querySelector("#sheetCopy");
const presetRow = document.querySelector("#presetRow");
const sheetNote = document.querySelector("#sheetNote");
const cameraButton = document.querySelector("#cameraButton");
const frontCameraButton = document.querySelector("#frontCameraButton");
const cameraInput = document.querySelector("#cameraInput");
const frontCameraInput = document.querySelector("#frontCameraInput");
const dimmer = document.querySelector("#focusDimmer");
const toast = document.querySelector("#toast");
const installTip = document.querySelector("#installTip");
const clockText = document.querySelector("#clockText");
const systemTone = document.querySelector("#systemTone");

let activeMode = modes[0] || null;
let toastTimer;

function renderModes() {
  if (!modes.length) {
    grid.innerHTML = '<p class="empty-state">未找到摄影模式配置。</p>';
    return;
  }

  grid.innerHTML = modes.map((mode) => `
    <button class="mode-card" type="button" data-mode="${mode.id}" style="--accent:${mode.accent};--accent-soft:${mode.accentSoft}">
      <span class="mode-symbol">${mode.icon}</span>
      <span class="mode-content">
        <h2>${mode.name}</h2>
        <p>${mode.description}</p>
        <span class="mode-tags">${mode.keywords.map((tag) => `<span>${tag}</span>`).join("")}</span>
      </span>
    </button>
  `).join("");
}

function openMode(mode) {
  if (!mode) return;

  activeMode = mode;
  document.documentElement.style.setProperty("--accent", mode.accent);
  document.documentElement.style.setProperty("--sheet-glow", mode.sheetGlow);
  sheetIcon.textContent = mode.icon;
  sheetKicker.textContent = "Preset Ready";
  sheetTitle.textContent = mode.name;
  sheetCopy.textContent = mode.prompt;
  presetRow.innerHTML = mode.advice.map((item) => `<span class="preset-pill">${item}</span>`).join("");
  sheetNote.textContent = mode.note;
  frontCameraButton.hidden = mode.camera !== "user";
  applyScene(mode);
  sheet.classList.add("active");
  sheet.setAttribute("aria-hidden", "false");
  showToast(`${mode.name} 已就绪`);
}

function closeMode() {
  sheet.classList.remove("active");
  sheet.setAttribute("aria-hidden", "true");
}

function applyScene(mode) {
  const opacity = Math.max(0, Math.min(0.46, 1 - mode.brightness));
  dimmer.style.background = `rgba(0, 0, 0, ${opacity})`;
  systemTone.textContent = mode.forceDark
    ? "深色氛围已启用"
    : mode.forceLight
      ? "清亮氛围已启用"
      : "自动适配系统外观";
}

function launchCamera(preferFront = false) {
  if (!activeMode) return;

  const input = preferFront ? frontCameraInput : (activeMode.camera === "user" ? frontCameraInput : cameraInput);
  showToast(preferFront || activeMode.camera === "user" ? "正在呼出前摄" : "正在呼出相机");
  closeMode();
  setTimeout(() => input.click(), 180);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function updateClock() {
  const now = new Date();
  clockText.textContent = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

renderModes();
updateClock();
setInterval(updateClock, 30000);

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-mode]");
  if (!card) return;
  const mode = modes.find((item) => item.id === card.dataset.mode);
  openMode(mode);
});

closeSheet.addEventListener("click", closeMode);
cameraButton.addEventListener("click", () => launchCamera(false));
frontCameraButton.addEventListener("click", () => launchCamera(true));

installTip.addEventListener("click", () => {
  showToast("Safari 中点分享按钮，再选“添加到主屏幕”");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMode();
});

window.addEventListener("pageshow", () => {
  if (navigator.standalone || window.matchMedia("(display-mode: standalone)").matches) {
    document.body.classList.add("standalone");
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
