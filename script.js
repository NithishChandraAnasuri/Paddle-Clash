const notificationSound = new Audio("./assets/ping_pong_huawei.mp3");
const gameOverSound = new Audio("./assets/gameover.mp3");

const ball = document.getElementById("ball");
const rod1 = document.getElementById("rod1");
const rod2 = document.getElementById("rod2");

const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score = 0,
  maxScore = localStorage.getItem(storeScore) || 0,
  movement,
  ballSpeedX = 2,
  ballSpeedY = 2,
  gameOn = false,
  windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;

function updateScoreDisplay(value) {
  const scoreBoard = document.getElementById("scoreBoard");
  if (scoreBoard) {
    scoreBoard.textContent = "Score: " + value * 100;
  }
}

function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";
  ball.style.top = (windowHeight - ball.offsetHeight) / 2 + "px";
  ballSpeedX = 2;
  ballSpeedY = 2;
  score = 0;
  gameOn = false;

  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
  } else if (rodName === rod1Name) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
  }
}

function storeWin(rod, score, gameOver = false) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeScore, maxScore);
  }

  clearInterval(movement);
  resetBoard(rod);

  alert(
    "Your current score is " +
      score * 100 +
      ". \nMax score is: " +
      maxScore * 100 +
      ".\nGame Over! Your paddling prowess needs... practice .\n Please Restart the Game"
  );

  if (gameOver) gameOverSound.play();
  else notificationSound.play();

  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

window.addEventListener("keydown", function (e) {
  const rodSpeed = 20;
  let rodRect = rod1.getBoundingClientRect();

  if (
    e.code === "ArrowRight" &&
    rodRect.x + rodRect.width < window.innerWidth
  ) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (e.code === "ArrowLeft" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  if (e.code === "Enter") startGame();
});

// TOUCH CONTROL
window.addEventListener("touchstart", (e) => {
  const touchX = e.touches[0].clientX;
  const rodCenter = rod1.getBoundingClientRect().x + rod1.offsetWidth / 2;

  if (touchX > rodCenter) {
    moveRod(20);
  } else {
    moveRod(-20);
  }

  if (!gameOn) startGame();
});

function moveRod(offset) {
  let newLeft = rod1.offsetLeft + offset;
  newLeft = Math.max(
    0,
    Math.min(window.innerWidth - rod1.offsetWidth, newLeft)
  );
  rod1.style.left = newLeft + "px";
  rod2.style.left = newLeft + "px";
}

function startGame() {
  if (gameOn) return;
  gameOn = true;

  notificationSound.play();

  let ballRect = ball.getBoundingClientRect();
  let ballX = ballRect.x;
  let ballY = ballRect.y;
  let ballDia = ballRect.width;

  let rod1Height = rod1.offsetHeight;
  let rod2Height = rod2.offsetHeight;
  let rod1Width = rod1.offsetWidth;
  let rod2Width = rod2.offsetWidth;

  movement = setInterval(() => {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    rod1X = rod1.getBoundingClientRect().x;
    rod2X = rod2.getBoundingClientRect().x;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    if (ballX + ballDia > windowWidth || ballX < 0) {
      ballSpeedX = -ballSpeedX;
    }

    let ballPos = ballX + ballDia / 2;

    if (ballY <= rod1Height) {
      ballSpeedY = -ballSpeedY;
      score++;
      updateScoreDisplay(score);

      if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
        storeWin(rod2Name, score, true);
      }
    } else if (ballY + ballDia >= windowHeight - rod2Height) {
      ballSpeedY = -ballSpeedY;
      score++;
      notificationSound.play();

      if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
        storeWin(rod1Name, score, true);
      }
    }
  }, 10);
}

// Animations
anime({
  targets: "#scoreBoard",
  opacity: [0, 0.5, 1],
  translateY: [100, 0],
  duration: 1000,
  delay: 1000,
  easing: "easeOutExpo",
});

anime({
  targets: "#ball",
  opacity: [0, 1],
  duration: 1500,
  delay: 3000,
  easing: "easeInOutQuad",
});

window.onload = () => {
  alert(
    maxScore == 0
      ? "This is the first time you are playing this game."
      : "You have a maximum score of " +
          maxScore * 100 +
          ". \nPress Enter or tap to start. Use touch or arrow keys to move."
  );

  resetBoard();

  gsap.from("#rod1", {
    y: -200,
    duration: 3,
    ease: "bounce.out",
  });

  gsap.from("#rod2", {
    y: 200,
    duration: 3,
    ease: "bounce.out",
  });
};
