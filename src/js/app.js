// import * as webpFn from "./modules/fn.js";

// webpFn.isWebp();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "./img/A7_no.png";
const foodImg = new Image();
foodImg.src = "./img/1760351_dessert_donut_food_sweet_icon.png";
const headImg = new Image();
headImg.src = "./img/snake_2469829.png";

const box = 32;
let score = 0;
let food = createFood();

let snake = [{ x: 9 * box, y: 10 * box }];

document.addEventListener("keydown", direction);
let dir;

let speed = 200; // Начальная скорость движения змейки (в миллисекундах)
let lastUpdateTime = 0;

function createFood() {
  return {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };
}

function direction(event) {
  if (event.keyCode === 37 && dir !== "right") {
    dir = "left";
  } else if (event.keyCode === 38 && dir !== "down") {
    dir = "up";
  } else if (event.keyCode === 39 && dir !== "left") {
    dir = "right";
  } else if (event.keyCode === 40 && dir !== "up") {
    dir = "down";
  }
}

function endGame() {
  cancelAnimationFrame(game);
  // Здесь можно добавить код для отображения сообщения о конце игры или перезапуска игры.
}

function drawHead(x, y) {
  ctx.save();
  ctx.translate(x + box / 2, y + box / 2);

  if (dir === "left") {
    ctx.rotate(Math.PI / 2);
  } else if (dir === "right") {
    ctx.rotate(-Math.PI / 2);
  } else if (dir === "up") {
    ctx.rotate(-Math.PI);
  }

  ctx.drawImage(headImg, -box / 2, -box / 2, box, box);
  ctx.restore();
}

function drawGame(currentTime) {
  const deltaTime = currentTime - lastUpdateTime;

  if (deltaTime > speed) {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
      if (i === 0) {
        drawHead(snake[i].x, snake[i].y);
      } else {
        ctx.fillStyle = `hsl(${Math.random() * 40}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(
          snake[i].x + box / 2,
          snake[i].y + box / 2,
          box / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX === food.x && snakeY === food.y) {
      score++;
      food = createFood();
    } else {
      snake.pop();
    }

    if (
      snakeX < box ||
      snakeX > box * 17 ||
      snakeY < 3 * box ||
      snakeY > box * 17
    ) {
      endGame();
    }

    if (dir === "left") snakeX -= box;
    if (dir === "right") snakeX += box;
    if (dir === "up") snakeY -= box;
    if (dir === "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    eatTail(newHead, snake);

    snake.unshift(newHead);

    lastUpdateTime = currentTime;
  }

  if (!endGameConditionMet()) {
    requestAnimationFrame(drawGame);
  }
}

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) {
      endGame();
    }
  }
}

function endGameConditionMet() {
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  return (
    snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17
  );
}

// Запуск игры
requestAnimationFrame(drawGame);
