let leftPaddle;
let rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;
let gameState = 'start'; // 'start', 'play', 'end'

function setup() {
  createCanvas(800, 400);

  // Criar paddles e bola
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
  ball = new Ball();
}

function draw() {
  background(255);

  if (gameState === 'start') {
    startScreen();
  } else if (gameState === 'play') {
    // Atualizar e mostrar paddles
    leftPaddle.update();
    rightPaddle.update();
    leftPaddle.show();
    rightPaddle.show();

    // Atualizar e mostrar bola
    ball.update();
    ball.show();
    
    // Verificar colisões com paddles
    if (ball.hitsPaddle(leftPaddle) || ball.hitsPaddle(rightPaddle)) {
      ball.xSpeed *= -1;
    }

    // Verificar pontuação
    let scored = ball.checkScore();
    if (scored === 'left') {
      leftScore++;
      ball.reset();
    } else if (scored === 'right') {
      rightScore++;
      ball.reset();
    }

    // Mostrar placar
    textAlign(CENTER);
    textSize(32);
    fill(0);
    text(leftScore, width / 4, 50);
    text(rightScore, 3 * width / 4, 50);
  } else if (gameState === 'end') {
    endScreen();
  }
}

function startScreen() {
  textAlign(CENTER);
  textSize(50);
  fill(0);
  text('Press ENTER to Start', width / 2, height / 2);
}

function endScreen() {
  textAlign(CENTER);
  textSize(50);
  fill(0);
  text('Game Over', width / 2, height / 2 - 50);
  text(leftScore + ' - ' + rightScore, width / 2, height / 2);
  textSize(30);
  text('Press ENTER to Restart', width / 2, height / 2 + 50);
}

function keyPressed() {
  if (gameState === 'start' && keyCode === ENTER) {
    gameState = 'play';
  } else if (gameState === 'end' && keyCode === ENTER) {
    resetGame();
    gameState = 'play';
  }
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
  ball = new Ball();
}

class Paddle {
  constructor(isLeft) {
    this.w = 10;
    this.h = 100;
    this.y = height / 2 - this.h / 2;
    if (isLeft) {
      this.x = 30;
    } else {
      this.x = width - 40;
    }
    this.ySpeed = 0;
    this.speed = 8;
  }

  update() {
    if (keyIsDown(87)) { // W key
      this.ySpeed = -this.speed;
    } else if (keyIsDown(83)) { // S key
      this.ySpeed = this.speed;
    } else {
      this.ySpeed = 0;
    }

    this.y = constrain(this.y + this.ySpeed, 0, height - this.h);
  }

  show() {
    fill(0);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Ball {
  constructor() {
    this.r = 10;
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random(3, 5) * (random() > 0.5 ? 1 : -1);
    this.ySpeed = random(1, 3) * (random() > 0.5 ? 1 : -1);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Colisão com as bordas verticais
    if (this.y - this.r < 0 || this.y + this.r > height) {
      this.ySpeed *= -1;
    }
  }

  show() {
    fill(0);
    ellipse(this.x, this.y, this.r * 2);
  }

  hitsPaddle(paddle) {
    if (this.x - this.r < paddle.x + paddle.w &&
        this.x + this.r > paddle.x &&
        this.y - this.r < paddle.y + paddle.h &&
        this.y + this.r > paddle.y) {
      return true;
    }
    return false;
  }

  checkScore() {
    if (this.x - this.r < 0) {
      return 'right';
    } else if (this.x + this.r > width) {
      return 'left';
    }
    return null;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random(3, 5) * (random() > 0.5 ? 1 : -1);
    this.ySpeed = random(1, 3) * (random() > 0.5 ? 1 : -1);
  }
}

