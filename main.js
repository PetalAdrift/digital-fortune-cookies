let fortunes = [];

fetch('data/fortune.json')
  .then(response => response.json())
  .then(data => {
    fortunes = data.stories;
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
  
let cookieCracked = 0;
  
cookieImg.addEventListener("click", () => {
    if (cookieCracked === 0) {
      // Temporarily disable transition
      cookieImg.classList.add("no-transition");
  
      // Trigger shake animation
      cookieImg.classList.add("shake");
  
      // Wait for shake to finish (0.8s), then proceed
      setTimeout(() => {
        cookieImg.classList.remove("shake", "no-transition");
  
        // Proceed with crack
        sound.currentTime = 0;
        sound.play();
        cookieImg.src = "img/cookie (broken).png";
        cookieCracked = 1;
  
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
            }, 600);
          }, i * 40);
        }
      }, 400); // duration of shake animation
    }
});  

restartBtn.addEventListener("click", () => {
    cookieImg.src = "img/cookie (whole).png";
    fortuneBox.textContent = "";
    cookieCracked = 0;
    restartBtn.style.display = 'none';
});