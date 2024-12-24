let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// Load images
let playerImg = new Image();
playerImg.src = "fighter.png";

let wallImg = new Image();
wallImg.src = "maze-wall.png";

let obstacleImg = new Image();
obstacleImg.src = "obstacle.png";

// the canvas
const width = 500;
const height = 500;
let frameRate = 60;

// Boolean for arrow key states
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

// Player
let player = {
  x: 50,
  y: 400,
  size: 50,
};

let finishLine = {
  x: 400,
  y: 50,
  width: 50,
  height: 50,
};

let obstacles = [
  { x: 100, y: 100, width: 50, height: 50 },
  { x: 350, y: 150, width: 50, height: 50 },
  { x: 200, y: 200, width: 50, height: 50 },
  { x: 150, y: 300, width: 50, height: 50 },
  { x: 350, y: 250, width: 50, height: 50 },
  { x: 250, y: 100, width: 50, height: 50 },
  { x: 250, y: 350, width: 50, height: 50 },
  { x: 50, y: 200, width: 50, height: 50 },
  { x: 50, y: 350, width: 50, height: 50 },
];

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  }
});

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function render() {
  ctx.clearRect(0, 0, width, height);

  // Player
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  // Finish line
  ctx.fillStyle = "green";
  ctx.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);

  // Obstacles
  for (let obstacle of obstacles) {
    ctx.drawImage(
      obstacleImg,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  }
}

function walls() {
  const wallSize = 50;

  // Top edge
  for (let i = 0; i < width; i += wallSize) {
    ctx.drawImage(wallImg, i, 0, wallSize, wallSize);
  }

  // Bottom edge
  for (let i = 0; i < width; i += wallSize) {
    ctx.drawImage(wallImg, i, height - wallSize, wallSize, wallSize);
  }

  // Left edge
  for (let i = wallSize; i < height - wallSize; i += wallSize) {
    ctx.drawImage(wallImg, 0, i, wallSize, wallSize);
  }

  // Right edge
  for (let i = wallSize; i < height - wallSize; i += wallSize) {
    ctx.drawImage(wallImg, width - wallSize, i, wallSize, wallSize);
  }
}

function update() {
  let newX = player.x;
  let newY = player.y;

  if (leftPressed) {
    newX -= 5;
  }
  if (rightPressed) {
    newX += 5;
  }
  if (upPressed) {
    newY -= 5;
  }
  if (downPressed) {
    newY += 5;
  }

  // player cannot touch edges
  if (
    newX >= 50 &&
    newX <= width - player.size - 50 &&
    newY >= 50 &&
    newY <= height - player.size - 50
  ) {
    // Check collision with obstacles
    let collision = false;
    for (let obstacle of obstacles) {
      if (
        isColliding(
          { x: newX, y: newY, width: player.size, height: player.size },
          obstacle
        )
      ) {
        collision = true;
        break;
      }
    }
    if (!collision) {
      player.x = newX;
      player.y = newY;
    }
  }

  // Check win condition
  if (
    player.x + player.size >= finishLine.x &&
    player.y <= finishLine.y + finishLine.height &&
    player.y + player.size >= finishLine.y
  ) {
    clearInterval(gameLoopInterval);
    alert("Congratulations! You win!");
  }
}

function gameLoop() {
  update();
  render();
  walls();
}

let gameLoopInterval = setInterval(gameLoop, 1000 / frameRate);
