import Phaser from "phaser";

////////////////////////////////////////////////////////////////////////////////
// BEGIN GAME DATA
////////////////////////////////////////////////////////////////////////////////
/** Phaser game config */
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: {
    preload,
    create,
    update,
  },
};

// General game metadata
let totalDelta = null;

// Pipe config data
const FIRST_PIPE_HORIZONTAL_POSITION = 0;
const PIPE_VERTICAL_DISTANCE_RANGE = [140, 200];
const PIPE_HORIZONTAL_DISTANCE_RANGE = [400, 500];
const PIPE_HOLE_RANGE = [80, 420];
const PIPE_TO_PIPE_DISTANCE = 400;
const PIPE_VELOCITY = -250;
const PIPES_TO_RENDER = 4;

// Bird config data
const BIRD_STARTING_X = config.width * 0.1;
const BIRD_STARTING_Y = config.height / 2;
const BIRD_GRAVITY = 400;
const BIRD_FLAP_VELOCITY = -225;

// Game state variables
let pipeHorizontalPosition = FIRST_PIPE_HORIZONTAL_POSITION;

// Sprites
let bird = null;
let pipes = null;

////////////////////////////////////////////////////////////////////////////////
// END GAME DATA
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// BEGIN GAME LOGIC
////////////////////////////////////////////////////////////////////////////////

/** Bird flapping wings */
function flap() {
  bird.body.velocity.y = BIRD_FLAP_VELOCITY;
  return;
}

/** Restart round (begin game / after loss) */
function restartRound() {
  // Reset player position
  bird.body.position.x = BIRD_STARTING_X;
  bird.body.position.y = BIRD_STARTING_Y;
  bird.body.velocity.y = 0;
}

/** Detect whether or not game has been lost */
function isGameLost() {
  // Did bird touch top or bottom of screen?
  if (bird.body.position.y <= 0 || bird.body.position.y >= config.height) {
    return true;
  }

  // TODO: Detect bird collision with pipe
  return false;
}

/** Place a set of pipes on the canvas */
function placePipeSet(uPipe, lPipe) {
  // Get horizontal position
  const rightMostXPosition = getRightMostPipe();
  let pipeHorizontalDistance = Phaser.Math.Between(
    ...PIPE_HORIZONTAL_DISTANCE_RANGE
  );
  pipeHorizontalPosition = rightMostXPosition + pipeHorizontalDistance;

  // Get vertical positions
  const pipeHole = Phaser.Math.Between(...PIPE_HOLE_RANGE);
  const pipeHoleSize = Phaser.Math.Between(...PIPE_VERTICAL_DISTANCE_RANGE);
  const lPipeVerticalPosition = pipeHole + pipeHoleSize / 2;
  const uPipeVerticalPosition = pipeHole - pipeHoleSize / 2;

  // Set positions
  uPipe.x = pipeHorizontalPosition;
  uPipe.y = uPipeVerticalPosition;
  lPipe.x = pipeHorizontalPosition;
  lPipe.y = lPipeVerticalPosition;

  console.log(
    `pipe horizontal: ${pipeHorizontalPosition}, pipe verticals: ${uPipeVerticalPosition} ${lPipeVerticalPosition}`
  );

  console.log("pipe positions", uPipe.body.position, lPipe.body.position);
}

/** Recycle pipe set */
function recyclePipes() {
  // Get out of bounds pipes
  let upperPipe = null;
  let lowerPipe = null;
  pipes.getChildren().forEach(function (pipe) {
    if (pipe.getBounds().right <= 0) {
      if (pipe.originY === 1) upperPipe = pipe;
      else lowerPipe = pipe;
    }
  });

  if (!upperPipe || !lowerPipe) return;

  // Place pipes
  placePipeSet(upperPipe, lowerPipe);
}

/** Get horizontal position of farthest pipe */
function getRightMostPipe() {
  let rightMostX = 0;

  pipes.getChildren().forEach(function (pipe) {
    rightMostX = Math.max(rightMostX, pipe.x);
  });

  return rightMostX;
}

////////////////////////////////////////////////////////////////////////////////
// END GAME LOGIC
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// BEGIN SCENE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

/** Scene preload step */
function preload() {
  // Load images
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

/** Scene create step */
function create() {
  // Set scene
  this.add.image(0, 0, "sky").setOrigin(0);

  // Set up bird
  bird = this.physics.add
    .sprite(BIRD_STARTING_X, BIRD_STARTING_Y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = BIRD_GRAVITY;

  // Set up pipes
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const uPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lPipe = pipes.create(0, 0, "pipe").setOrigin(0);

    placePipeSet(uPipe, lPipe);
  }

  pipes.setVelocityX(PIPE_VELOCITY);

  // Set control scheme
  this.input.keyboard.on("keydown_SPACE", flap);
  this.input.on("pointerdown", flap);
}

/** Scene update step */
function update(time, delta) {
  totalDelta += delta;

  if (isGameLost()) restartRound();

  recyclePipes();
}

////////////////////////////////////////////////////////////////////////////////
// END SCENE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

new Phaser.Game(config);
