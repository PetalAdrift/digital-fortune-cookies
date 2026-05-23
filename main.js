let fortuneData = {};
let fortunes = [];
let fortuneKeys = [];
let fortuneKeyIndex = 0;

const FORTUNE_FONT_SIZES = {
  stories: { desktop: "1.5rem", mobile: "1.1rem" },
  remarks: { desktop: "3rem", mobile: "2rem" },
  default: { desktop: "2rem", mobile: "1.4rem" }
};

function applyFortuneFontSize(key) {
  const size = FORTUNE_FONT_SIZES[key] || FORTUNE_FONT_SIZES.default;

  document.documentElement.style.setProperty("--fortune-font-size", size.desktop);
  document.documentElement.style.setProperty("--fortune-font-size-mobile", size.mobile);
}

function setFortuneMode(index) {
  if (fortuneKeys.length === 0) return;

  fortuneKeyIndex = (index + fortuneKeys.length) % fortuneKeys.length;

  const key = fortuneKeys[fortuneKeyIndex];
  fortunes = fortuneData[key];

  applyFortuneFontSize(key);

  const fortuneModeBtn = document.getElementById("fortune-mode-btn");
  fortuneModeBtn.title = `Current fortune mode: ${key}`;
  fortuneModeBtn.setAttribute("aria-label", `Switch fortune mode. Current mode: ${key}`);
}

fetch('data/fortune.json')
  .then(response => response.json())
  .then(data => {
    fortuneData = data;
    fortuneKeys = Object.keys(data).filter(key => Array.isArray(data[key]) && data[key].length > 0);

    const defaultIndex = Math.max(0, fortuneKeys.indexOf("remarks"));
    setFortuneMode(defaultIndex);
  })
  .catch(error => {
    console.error("Failed to load fortunes:", error);
  });

console.log("Credits:\n Designed by Hoyii 🌸 with support from her friend Zhihan 🕖 and the AI chatbot 🤖.\n Sound effect (crumble) adapted from work of freesound_community (Pixabay).\n Font (Pixelify Sans) designed by Stefie Justprince.")

const cookieContainer = document.getElementById("cookie-container");
const cookieImg = document.getElementById("cookie-img");
const sound = document.getElementById("crack-sound");
const fortuneBox = document.getElementById("fortune-box");
const restartBtn = document.getElementById('restart-btn');
const fortuneModeSwitch = document.getElementById("fortune-mode-switch");

function resetCookie() {
  cookieImg.src = "img/cookie (whole).png";
  fortuneBox.textContent = "";
  cookieCracked = 0;
  restartBtn.style.display = "none";
}

let bgmPlaying = false;
let cookieCracked = 0;

document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  bgm.loop = true;
  bgm.volume = 0.6; // Quieter volume
  const toggle = document.getElementById("bgm-toggle");

  let isPlaying = false;

  function playBGM() {
    bgm.play().then(() => {
      isPlaying = true;
      toggle.src = "img/bgm-on.png";
    }).catch((err) => {
      console.log("Autoplay blocked:", err);
    });
  }

  // Start BGM after first interaction (e.g. click anywhere)
  window.addEventListener("click", () => {
    if (!isPlaying) playBGM();
  }, { once: true });

  // Toggle handler
  toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // avoid also triggering window click
    if (bgm.paused) {
      bgm.play();
      toggle.src = "img/bgm-on.png";
    } else {
      bgm.pause();
      toggle.src = "img/bgm-off.png";
    }
  });
});

cookieImg.addEventListener("click", () => {
  if (cookieCracked === 0) {
    // Temporarily disable transition
    cookieImg.classList.add("no-transition");

    // Trigger shake animation
    cookieImg.classList.add("shake");

    // Start crack process
    setTimeout(() => {

      // Play crack sound
      sound.currentTime = 0;
      sound.play();

      // Wait for shake to finish
      setTimeout(() => {
        // Cracked cookie sprite
        cookieImg.src = "img/cookie (broken).png";
        cookieCracked = 1;
        cookieImg.classList.remove("shake", "no-transition");

        // Get fortune
        if (fortunes.length === 0) {
          console.warn("No fortunes are loaded for the current fortune mode.");
          return;
        }
        const selected = fortunes[Math.floor(Math.random() * fortunes.length)];
        randomFortune = selected.text;
        console.log("Contributor:", selected.contributor);
        fortuneBox.textContent = '';

        for (let i = 0; i < randomFortune.length; i++) {
          setTimeout(() => {
            const floatSpan = document.createElement('span');
            floatSpan.className = 'floating-letter';
            floatSpan.textContent = randomFortune[i];
            cookieContainer.appendChild(floatSpan);

            setTimeout(() => {
              floatSpan.remove();
              fortuneBox.textContent = randomFortune.slice(0, i + 1);

              if (i === randomFortune.length - 1) {
                restartBtn.style.display = 'inline-block';
              }
            }, 600); // Delay between initiating floating letter and its appearance in fortune box
          }, i * 40); // Delay between letters
        }
      }, 100); // Advance of sfx
    }, 300); // Time before playing sfx (400 minus advance)
  }
});

restartBtn.addEventListener("click", () => {
  resetCookie();
});

fortuneModeSwitch.addEventListener("click", (e) => {
  e.stopPropagation();

  if (fortuneKeys.length === 0) return;

  setFortuneMode(fortuneKeyIndex + 1);
  resetCookie();
});