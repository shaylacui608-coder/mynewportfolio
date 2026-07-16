const animationGrid = document.querySelector("#animationGrid");
const playBtn = document.querySelector("#playBtn");
const playIcon = document.querySelector("#playIcon");
const playText = document.querySelector("#playText");
const restartBtn = document.querySelector("#restartBtn");
const loopBtn = document.querySelector("#loopBtn");
const scrubber = document.querySelector("#scrubber");
const currentTime = document.querySelector("#currentTime");
const speedButtons = document.querySelectorAll(".speed-button");

const lottieFiles = [
  { title: "诊断问题", slot: 1, segments: ["Untitled file.json"] },
  { title: "", slot: 2, isCompanion: true, image: "APP首页.png" },
  { title: "传素材", slot: 3, segments: ["第二页.json"] },
  { title: "AI生成", slot: 4, segments: ["Untitled file——2.json", "Untitled file——3.json", "画板 (1).json"] },
  { title: "选结果", slot: 5, segments: ["动销4-前.json", "动销4-后.json"] },
  { title: "你成功啦", slot: 6, segments: ["动销5.json"] },
];

const assetVersion = "20260712-1716";

const players = [];
let isDragging = false;
let isLooping = true;
let isPlaying = true;
let activeSpeed = 1;
let activePlayerIndex = 0;

const formatTime = (seconds) => `${seconds.toFixed(1)}s`;
const labelFor = (item) => item.image || item.segments.join(" + ");

const updatePlayButton = () => {
  playBtn.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
  playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  playText.textContent = isPlaying ? "暂停" : "播放";
};

const createCard = (item) => {
  const { title, slot, isCompanion = false, segments = [] } = item;
  const card = document.createElement("article");
  card.className = "preview-card";
  if (slot) card.classList.add(`slot-${slot}`);
  if (isCompanion) card.classList.add("is-companion");
  card.innerHTML = `
    <div class="card-head">
      ${title ? `<h2>${title}</h2>` : "<h2 aria-hidden=\"true\"></h2>"}
      <span title="${labelFor(item)}">${labelFor(item)}</span>
    </div>
    <div class="phone-frame">
      <div class="stage-stack"></div>
      <div class="loading-state">加载中</div>
    </div>
    <div class="card-foot">
      <span class="frame-time">0.0s</span>
      <span class="duration-time">--</span>
    </div>
  `;
  animationGrid.append(card);

  const stack = card.querySelector(".stage-stack");
  const stages = segments.map(() => {
    const stage = document.createElement("div");
    stage.className = "animation-stage is-hidden";
    stack.append(stage);
    return stage;
  });

  return {
    activeIndex: 0,
    animations: [],
    card,
    durationTime: card.querySelector(".duration-time"),
    frameTime: card.querySelector(".frame-time"),
    isLoaded: false,
    isLoading: false,
    loading: card.querySelector(".loading-state"),
    segments,
    stages,
  };
};

const segmentDurationSeconds = (animation) =>
  animation && animation.totalFrames ? animation.totalFrames / (animation.frameRate || 30) : 0;

const playerDurationSeconds = (player) =>
  player.animations.reduce((total, animation) => total + segmentDurationSeconds(animation), 0);

const playerCurrentSeconds = (player) => {
  const before = player.animations
    .slice(0, player.activeIndex)
    .reduce((total, animation) => total + segmentDurationSeconds(animation), 0);
  const active = player.animations[player.activeIndex];
  return before + (active ? active.currentFrame / (active.frameRate || 30) : 0);
};

const playerProgress = (player) => {
  const duration = playerDurationSeconds(player);
  if (!duration) return 0;
  return playerCurrentSeconds(player) / duration;
};

const activePlayer = () => players[activePlayerIndex];
const isActivePlayer = (player) => player === activePlayer();

const sequenceDurationSeconds = () =>
  players.reduce((total, player) => total + playerDurationSeconds(player), 0);

const sequenceCurrentSeconds = () => {
  const before = players
    .slice(0, activePlayerIndex)
    .reduce((total, player) => total + playerDurationSeconds(player), 0);
  return before + (activePlayer() ? playerCurrentSeconds(activePlayer()) : 0);
};

const updateScrubber = () => {
  if (isDragging || players.length === 0) return;
  const duration = sequenceDurationSeconds();
  if (!duration) return;
  const progress = sequenceCurrentSeconds() / duration;
  scrubber.value = Math.round(progress * 1000);
  currentTime.textContent = `${Math.round(progress * 100)}%`;
};

const updateCardTime = (player) => {
  player.frameTime.textContent = formatTime(playerCurrentSeconds(player));
  const duration = playerDurationSeconds(player);
  player.durationTime.textContent = duration ? formatTime(duration) : `${player.activeIndex + 1}/${player.segments.length}`;
};

const showLoadError = (player) => {
  player.loading.textContent = "动效加载失败";
  player.loading.classList.remove("is-hidden");
};

const showSegment = (player, index, shouldPlay = isPlaying) => {
  player.activeIndex = index;
  player.stages.forEach((stage, stageIndex) => stage.classList.toggle("is-hidden", stageIndex !== index));
  player.animations.forEach((animation, animationIndex) => {
    if (!animation) return;
    if (animationIndex === index && shouldPlay && isActivePlayer(player)) animation.play();
    else animation.pause();
  });
  updateCardTime(player);
  updateScrubber();
};

const restartPlayer = (player, shouldPlay = isPlaying) => {
  player.animations.forEach((animation) => {
    animation?.goToAndStop(0, true);
    animation?.setSpeed(activeSpeed);
  });
  showSegment(player, 0, shouldPlay);
};

const completePlayer = (player) => {
  if (!isActivePlayer(player)) return;

  if (player.activeIndex < player.animations.length - 1) {
    const nextIndex = player.activeIndex + 1;
    player.animations[nextIndex].goToAndStop(0, true);
    showSegment(player, nextIndex, isPlaying);
    return;
  }

  const nextPlayerIndex = activePlayerIndex + 1;
  if (nextPlayerIndex < players.length) {
    activePlayerIndex = nextPlayerIndex;
    restartPlayer(players[activePlayerIndex], isPlaying);
    updateScrubber();
    return;
  }

  if (isLooping && players.length > 0) {
    players.forEach((item) => restartPlayer(item, false));
    activePlayerIndex = 0;
    restartPlayer(players[0], isPlaying);
    updateScrubber();
    return;
  }

  isPlaying = false;
  updatePlayButton();
};

const seekPlayer = (player, progress, shouldPlay) => {
  const totalDuration = playerDurationSeconds(player);
  if (!totalDuration) return;

  const targetSeconds = Math.min(totalDuration - 0.001, Math.max(0, totalDuration * progress));
  let accumulated = 0;
  let targetIndex = 0;
  let targetFrame = 0;

  for (let index = 0; index < player.animations.length; index += 1) {
    const animation = player.animations[index];
    const duration = segmentDurationSeconds(animation);
    if (targetSeconds < accumulated + duration || index === player.animations.length - 1) {
      targetIndex = index;
      targetFrame = (targetSeconds - accumulated) * (animation.frameRate || 30);
      break;
    }
    accumulated += duration;
  }

  const animation = player.animations[targetIndex];
  showSegment(player, targetIndex, false);
  if (shouldPlay && isActivePlayer(player)) animation.goToAndPlay(targetFrame, true);
  else animation.goToAndStop(targetFrame, true);
};

const seekSequence = (progress, shouldPlay) => {
  const duration = sequenceDurationSeconds();
  if (!duration) return;

  const targetSeconds = Math.min(duration - 0.001, Math.max(0, duration * progress));
  let accumulated = 0;
  let targetPlayerIndex = 0;
  let localProgress = 0;

  for (let index = 0; index < players.length; index += 1) {
    const player = players[index];
    const playerDuration = playerDurationSeconds(player);
    if (targetSeconds < accumulated + playerDuration || index === players.length - 1) {
      targetPlayerIndex = index;
      localProgress = playerDuration ? (targetSeconds - accumulated) / playerDuration : 0;
      break;
    }
    accumulated += playerDuration;
  }

  activePlayerIndex = targetPlayerIndex;
  players.forEach((player, index) => {
    if (index === targetPlayerIndex) {
      seekPlayer(player, localProgress, shouldPlay);
      return;
    }

    if (index < targetPlayerIndex && player.animations.length > 0) {
      const lastIndex = player.animations.length - 1;
      const lastAnimation = player.animations[lastIndex];
      showSegment(player, lastIndex, false);
      lastAnimation.goToAndStop(Math.max(0, lastAnimation.totalFrames - 1), true);
      return;
    }

    restartPlayer(player, false);
  });
};

const loadAnimations = (player) => {
  if (player.isLoaded || player.isLoading) return;
  player.isLoading = true;
  player.loading.textContent = "加载中";
  player.loading.classList.remove("is-load-trigger");

  player.animations = player.segments.map((segment, index) => {
    const animation = window.lottie.loadAnimation({
      autoplay: false,
      container: player.stages[index],
      loop: false,
      path: `./${encodeURIComponent(segment)}?v=${assetVersion}`,
      renderer: "svg",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });

    animation.setSpeed(activeSpeed);

    animation.addEventListener("DOMLoaded", () => {
      player.isLoaded = true;
      player.loading.classList.add("is-hidden");
      updateCardTime(player);
      if (index === 0 && player.activeIndex === 0 && isPlaying && isActivePlayer(player)) {
        player.stages[0].classList.remove("is-hidden");
        animation.play();
      }
    });

    animation.addEventListener("enterFrame", () => {
      if (index !== player.activeIndex) return;
      updateCardTime(player);
      updateScrubber();
    });

    animation.addEventListener("complete", () => {
      if (index === player.activeIndex) completePlayer(player);
    });

    animation.addEventListener("data_failed", () => showLoadError(player));
    return animation;
  });

  showSegment(player, 0, false);
};

const loadStaticImage = (player, image) => {
  player.isLoading = true;
  player.loading.textContent = "加载中";
  const img = document.createElement("img");
  img.className = "static-screen";
  img.alt = player.card.querySelector("h2")?.textContent || "";
  img.src = `./${encodeURIComponent(image)}?v=${assetVersion}`;
  img.addEventListener("load", () => {
    player.isLoaded = true;
    player.loading.classList.add("is-hidden");
  });
  img.addEventListener("error", () => showLoadError(player));
  player.card.querySelector(".stage-stack").append(img);
};

const loadPlayer = (item) => {
  const player = createCard(item);

  if (item.image) {
    loadStaticImage(player, item.image);
    return;
  }

  players.push(player);

  if (item.lazy) {
    player.loading.textContent = "点击加载";
    player.loading.classList.add("is-load-trigger");
    player.loading.addEventListener("click", () => loadAnimations(player));

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            loadAnimations(player);
          }
        },
        { rootMargin: "500px" },
      );
      observer.observe(player.card);
    }

    updateCardTime(player);
    return;
  }

  loadAnimations(player);
};

if (!window.lottie) {
  lottieFiles.forEach((item) => {
    const player = createCard(item);
    if (item.image) loadStaticImage(player, item.image);
    else showLoadError(player);
  });
} else {
  lottieFiles.forEach(loadPlayer);
}

playBtn.addEventListener("click", () => {
  isPlaying = !isPlaying;
  const player = activePlayer();
  const animation = player?.animations[player.activeIndex];
  if (animation) {
    if (isPlaying) animation.play();
    else animation.pause();
  }
  updatePlayButton();
});

restartBtn.addEventListener("click", () => {
  isPlaying = true;
  activePlayerIndex = 0;
  players.forEach((player) => restartPlayer(player, false));
  if (players[0]) restartPlayer(players[0], true);
  updatePlayButton();
});

loopBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  loopBtn.classList.toggle("is-active", isLooping);
  loopBtn.setAttribute("aria-pressed", String(isLooping));
});

scrubber.addEventListener("input", (event) => {
  isDragging = true;
  const progress = Number(event.target.value) / 1000;
  currentTime.textContent = `${Math.round(progress * 100)}%`;
  seekSequence(progress, false);
});

scrubber.addEventListener("change", (event) => {
  const progress = Number(event.target.value) / 1000;
  isDragging = false;
  seekSequence(progress, isPlaying);
});

speedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSpeed = Number(button.dataset.speed);
    players.forEach((player) => player.animations.forEach((animation) => animation?.setSpeed(activeSpeed)));
    speedButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

updatePlayButton();
