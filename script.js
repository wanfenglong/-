const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("start");

const size = 20;
const cells = canvas.width / size;
const speed = 120;

let state = {
  snake: [],
  direction: { x: 1, y: 0 },
  nextDirection: { x: 1, y: 0 },
  food: { x: 10, y: 10 },
  score: 0,
  timer: null,
  playing: false,
};

function randomFood(snake) {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * cells),
      y: Math.floor(Math.random() * cells),
    };
  } while (snake.some((part) => part.x === position.x && part.y === position.y));
  return position;
}

function resetGame() {
  state.snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ];
  state.direction = { x: 1, y: 0 };
  state.nextDirection = { x: 1, y: 0 };
  state.food = randomFood(state.snake);
  state.score = 0;
  state.playing = true;
  updateScore();
  statusEl.textContent = "游戏进行中，加油！";
  clearInterval(state.timer);
  state.timer = setInterval(step, speed);
  draw();
}

function updateScore() {
  scoreEl.textContent = state.score;
}

function endGame() {
  state.playing = false;
  clearInterval(state.timer);
  statusEl.textContent = "游戏结束，点击重新开始";
}

function handleKey(e) {
  const map = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };
  const next = map[e.key];
  if (!next) return;
  const { x, y } = state.direction;
  if (next.x === -x && next.y === -y) return;
  state.nextDirection = next;
}

document.addEventListener("keydown", handleKey);
startBtn.addEventListener("click", resetGame);

function step() {
  state.direction = state.nextDirection;
  const head = state.snake[0];
  const newHead = {
    x: head.x + state.direction.x,
    y: head.y + state.direction.y,
  };

  const hitWall =
    newHead.x < 0 || newHead.x >= cells || newHead.y < 0 || newHead.y >= cells;
  const hitSelf = state.snake.some((part) => part.x === newHead.x && part.y === newHead.y);
  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  state.snake.unshift(newHead);

  const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
  if (ateFood) {
    state.score += 1;
    updateScore();
    state.food = randomFood(state.snake);
  } else {
    state.snake.pop();
  }

  draw();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= cells; i++) {
    ctx.beginPath();
    ctx.moveTo(i * size + 0.5, 0);
    ctx.lineTo(i * size + 0.5, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * size + 0.5);
    ctx.lineTo(canvas.width, i * size + 0.5);
    ctx.stroke();
  }
}

function drawSnake() {
  state.snake.forEach((part, index) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#38bdf8");
    gradient.addColorStop(1, "#2563eb");

    ctx.fillStyle = index === 0 ? "#fbbf24" : gradient;
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(part.x * size + 3, part.y * size + 3, size - 6, size - 6, 4);
    ctx.fill();
    ctx.stroke();
  });
}

function drawFood() {
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "rgba(239, 68, 68, 0.7)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(
    state.food.x * size + size / 2,
    state.food.y * size + size / 2,
    size / 2.4,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;
}

function clearCanvas() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clearCanvas();
  drawGrid();
  drawFood();
  drawSnake();
}

draw();
