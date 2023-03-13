let duckIdleImg;
let duckWalkImg1;
let duckWalkImg2;
let duckWalkImg3;
let duckWalkImg4;
let duckDeadImg;

let duck;

let sound;

let myFont;

let score = 0;

let isMovingLeft = false;
let isMovingRight = false;
let isJumping = false;

let lastTetrominoTime = 0;

let tetrominos = [];
let staticTetrominos = [];
let images = [];

function gameOver() {
  noLoop(); 
  window.location.replace("game-over.html"); 
}

function preload() {
  duckIdleImg = loadImage('assets/duckIdleImg.png');
  console.log("loaded idle img!!");
  duckWalkImg1 = loadImage('assets/duckWalkImg1.png');
  duckWalkImg2 = loadImage('assets/duckWalkImg1.png');
  duckWalkImg3 = loadImage('assets/duckWalkImg2.png');
  duckWalkImg4 = loadImage('assets/duckWalkImg2.png');
  duckDeadImg = loadImage('assets/duckDeadImg.png');

  images.push(loadImage('assets/i-block.png'));
  images.push(loadImage('assets/j-block.png'));
  images.push(loadImage('assets/l-block.png'));
  images.push(loadImage('assets/o-block.png'));
  images.push(loadImage('assets/s-block.png'));
  images.push(loadImage('assets/t-block.png'));
  images.push(loadImage('assets/z-block.png'));

  soundFormats('mp3', 'ogg');
  sound = loadSound('assets/Tetris.mp3');

  myFont = loadFont("assets/PressStart2P-Regular.ttf");
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  frameRate(30); // set a constant frame rate for the sketch
  duck = new Player((width - width/2 - 100), (height - 100), 100, 100, [duckIdleImg], [duckWalkImg1, duckWalkImg2, duckWalkImg3, duckWalkImg4], [duckDeadImg, ]);

  sound.play();
  textFont(myFont);


  // Listen for keydown events
  window.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
      isMovingLeft = true;
      duck.walk();
    } else if (event.code === "ArrowRight") {
      isMovingRight = true;
      duck.walk();
    } else if (event.code === "ArrowUp") {
      if (!isJumping) {
        isJumping = true;
        duck.jump();
      }
    }
  });

  // Listen for keyup events
  window.addEventListener("keyup", function(event) {
    if (event.code === "ArrowLeft") {
      isMovingLeft = false;
      duck.stopMoving(); // Call stopMoving() when stopping
    } else if (event.code === "ArrowRight") {
      isMovingRight = false;
      duck.stopMoving(); // Call stopMoving() when stopping
    }
    else if (event.code === "ArrowUp") {
      duck.stopMoving(); // Call stopMoving() when stopping
    }
  });

  for (let i = 0; i < 7; i++) {
    let type;
    switch (i) {
      case 0:
        type = new IBlock();
        break;
      case 1:
        type = new JBlock();
        break;
      case 2:
        type = new LBlock();
        break;
      case 3:
        type = new OBlock();
        break;
      case 4:
        type = new SBlock();
        break;
      case 5:
        type = new TBlock();
        break;
      case 6:
        type = new ZBlock();
        break;
    }
    type.setImage(images[i]);
    tetrominos.push(type);
  }
  
}

function displayScore() {
  textSize(42);
  fill(255);
  text("Score: " + score, 10, 50); // Display the score on the canvas
}

function draw() {

    background(0);
  
    let timeElapsed = millis() - lastTetrominoTime;
    if (timeElapsed > random(500, 2000)) {
      let type = random(tetrominos);
      let newTetromino = new type.constructor();
      newTetromino.setImage(type.image);
      tetrominos.push(newTetromino);
      lastTetrominoTime = millis();
    }

// CONTEXT:
// my initial idea was to have blocks that fell and stacked on top of each other
// and a character that climbed the blocks and dodged the other blocks
// the static blocks were intended to be the blocks that hit the ground, and no longer could move
// however, i changed my idea for the game
// but for some reason, getting rid of it causes my code to not compile 
// so it might look a little messy, but it works!

  let currentTetromino = tetrominos[tetrominos.length - 1];
  let isColliding = false;
  for (let i = 0; i < staticTetrominos.length; i++) {
    let staticTetromino = staticTetrominos[i];
    if (currentTetromino.collidesWith(staticTetromino)) {
      isColliding = true;
      break;
    }
  }


  // if the current tetromino is colliding, add it to the static tetrominos and create a new tetromino at the top of the screen
  if (isColliding) {
    currentTetromino.y -= currentTetromino.blockSize; // move the tetromino up by one block so it's not overlapping
    currentTetromino.isStatic = true; // set  isStatic to true
    staticTetrominos.push(currentTetromino);
    tetrominos.pop(); // remove the current tetromino from the tetrominos array

    // create a new tetromino at the top of the screen
    let type = random(tetrominos);
    let newTetromino = new type.constructor();
    newTetromino.setImage(type.image);
    tetrominos.push(newTetromino);
  }

  for (let i = 0; i < tetrominos.length; i++) {
    tetrominos[i].show();
    if (!tetrominos[i].isStatic) {
      tetrominos[i].fall();
      score++;
    }
    if (duck.collidesWith(tetrominos[i])) {
      // The duck has collided with a tetromino, so make it die
      duck.die();
    }
}
  

  // Show all the static tetrominos
  for (let i = 0; i < staticTetrominos.length; i++) {
    staticTetrominos[i].show();
    if (duck.collidesWith(staticTetrominos[i])) {
      // The duck has collided with a tetromino, so make it die
      duck.die();
    }
}
  

    // Check if the left or right arrow keys are being held down, and move the duck accordingly
    if (isMovingLeft) {
      duck.moveLeft();
    }
    if (isMovingRight) {
      duck.moveRight();
    }
  
    if (isJumping) {
      duck.jump();
      isJumping = false; // reset isJumping to false so that the player doesn't keep jumping
    }
  
    // If there are less than 10 tetrominos in the array, add a new one
    if (tetrominos.length < 10) {
      let type = random(tetrominos); // Pick a random tetromino type from the array
      let newTetromino = new type.constructor(); // Create a new tetromino of that type
      newTetromino.setImage(type.image); // Set the image for the new tetromino
      tetrominos.push(newTetromino); // Add the new tetromino to the array
    }  

  duck.show();
  duck.animate();
  duck.update();

  localStorage.setItem('finalScore', score);

  displayScore();
}



class Player {
  constructor(x, y, width, height, frames, walkFrames, dieFrames) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frames = frames;
    this.walkFrames = walkFrames;
    this.dieFrames = dieFrames;
    this.isJumping = false;
    this.currentFrame = 0;
    this.isWalking = false;
    this.isDead = false;
    this.jumpForce = -4;
    this.velocity = 0;
    this.direction = 1; // 1 for right, -1 for left
    this.walkingFrameRate = 10;
  }

  show() {
    push(); // save the current drawing style
    translate(this.x + this.width / 2, this.y + this.height / 2); // translate to the center of the player
    scale(this.direction, 1); // flip the image horizontally if direction is -1
    if (this.isDead) {
      // show die animation
      image(this.dieFrames[this.currentFrame], -this.width / 2, -this.height / 2, this.width, this.height);
    } else if (this.isJumping) {
      // show jump animation
      image(this.frames[0], -this.width / 2, -this.height / 2, this.width, this.height);
    } else if (this.isWalking) {
      // show walk animation
      image(this.walkFrames[this.currentFrame], -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      // show static image
      image(this.frames[0], -this.width / 2, -this.height / 2, this.width, this.height);
    }
    pop(); // restore the previous style
  }

  moveRight() {
    this.direction = 1; // set direction to right
    this.x += 5; // move 5 pixels to the right
  }

  moveLeft() {
    this.direction = -1; // set direction to left 
    this.x -= 5; 
  }

  walk() {
    if (!this.isWalking) {
      this.isWalking = true;
    }
  }

  stopMoving() {
    this.isWalking = false;
  }

  stopJumping() {
    this.isJumping = false;
  }

  jump() {
    this.isJumping = true;
    this.velocity += this.jumpForce;
  }
  
  update() {
    if (this.isJumping) {
      this.velocity += 0.5;
      this.y += this.velocity;
  
      if (this.y >= (height - 50) - this.height / 2) {
        // duck has landed, stop jumping
        this.y = (height - 50) - this.height / 2;
        this.isJumping = false;
        this.velocity = 0;
      }
    }
  }
  

  die() {
    this.isDead = true;
    this.currentFrame = 0;
    console.log("ded");
    gameOver();
  }


  animate() {
    if (this.isDead) {
        // animate die frames
        this.currentFrame++;
        if (this.currentFrame >= this.dieFrames.length) {
            this.currentFrame = this.dieFrames.length - 1;
        }
    } else if (this.isJumping) {
        // animate jump frames
        this.currentFrame = 2;
    } else if (this.isWalking) {
      // animate walk frames
      this.currentFrame++;
      if (this.currentFrame >= this.walkFrames.length) {
        this.currentFrame = 0;
      }
    } else {
        // show static image
        this.currentFrame = 0;
    }
  }

  
  collidesWith(Tetromino) {
    // calculate the sides of the player and block
    let playerLeft = this.x;
    let playerRight = this.x + this.width;
    let playerTop = this.y;
    let playerBottom = this.y + this.height;

    let blockLeft = Tetromino.x;
    let blockRight = Tetromino.x + Tetromino.width;
    let blockTop = Tetromino.y;
    let blockBottom = Tetromino.y + Tetromino.height;

    // check for overlap between player and block
    if (
      playerLeft < blockRight &&
      playerRight > blockLeft &&
      playerTop < blockBottom &&
      playerBottom > blockTop
    ) {
      return true;
    }

    return false;
  }
}

class Tetromino {
  constructor() {
    this.x = random(width);
    this.y = -50;
    this.width = 50;
    this.height = 50;
    this.speed = 3;
    this.image = null;
    this.stopped = false; // added stopped property
  }

  setImage(image) {
    this.image = image;
  }

  show() {
    image(this.image, this.x, this.y, this.width, this.height);
  }

  fall() {
    if (this.stopped) return;

    this.y += this.speed;

  }
}


class IBlock extends Tetromino {
  constructor() {
    super();
    this.width = 50;
    this.height = 200;
  }
}

class JBlock extends Tetromino {
  constructor() {
    super();
    this.width = 150;
    this.height = 100;
  }
}

class LBlock extends Tetromino {
  constructor() {
    super();
    this.width = 100;
    this.height = 150;
  }
}

class OBlock extends Tetromino {
  constructor() {
    super();
    this.width = 100;
    this.height = 100;
  }
}

class SBlock extends Tetromino {
  constructor() {
    super();
    this.width = 150;
    this.height = 100;
  }
}

class TBlock extends Tetromino {
  constructor() {
    super();
    this.width = 150;
    this.height = 100;
  }
}

class ZBlock extends Tetromino {
  constructor() {
    super();
    this.width = 150;
    this.height = 100;
  }
}