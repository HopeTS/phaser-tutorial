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
let upperPipe = null;
let lowerPipe = null;
const FIRST_PIPE_DISTANCE = config.width / 2;
const PIPE_VERTICAL_DISTANCE_RANGE = [140, 200];
const PIPE_HOLE_RANGE = [80, 420];
const PIPE_HORIZONTAL_DISTANCE = 400;
const PIPE_VELOCITY = -300;
const PIPES_TO_RENDER = 4;

// Bird config data
let bird = null;
const BIRD_STARTING_X = config.width * 0.1;
const BIRD_STARTING_Y = config.height / 2;
const BIRD_GRAVITY = 400;
const BIRD_FLAP_VELOCITY = -225;

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

  return;
}

/** Generate vertical coordinates for pipe set */
function getPipeVerticalPositions() {
  // Get center of pipe hole and hole size
  const pipeHole = Phaser.Math.Between(...PIPE_HOLE_RANGE);
  const pipeHoleSize = Phaser.Math.Between(...PIPE_VERTICAL_DISTANCE_RANGE);

  return {
    lower: pipeHole + pipeHoleSize / 2,
    upper: pipeHole - pipeHoleSize / 2,
  };
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
  return;
}

/** Scene create step */
function create() {
  // Set scene
  this.add.image(0, 0, "sky").setOrigin(0);

  // Set bird
  bird = this.physics.add
    .sprite(BIRD_STARTING_X, BIRD_STARTING_Y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = BIRD_GRAVITY;

  // Set pipes (This should be changed)
  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    // Calculate positions
    const verticalPositions = getPipeVerticalPositions();
    const horizontalPosition =
      i * PIPE_HORIZONTAL_DISTANCE + FIRST_PIPE_DISTANCE;

    console.log("Pipe postions", horizontalPosition, verticalPositions);

    // Create sprites
    upperPipe = this.physics.add
      .sprite(horizontalPosition, verticalPositions.upper, "pipe")
      .setOrigin(0, 1);
    lowerPipe = this.physics.add
      .sprite(horizontalPosition, verticalPositions.lower, "pipe")
      .setOrigin(0, 0);

    // Set pipe speed
    upperPipe.body.velocity.x = PIPE_VELOCITY;
    lowerPipe.body.velocity.x = PIPE_VELOCITY;
  }

  // Set control scheme
  this.input.keyboard.on("keydown_SPACE", flap);
  this.input.on("pointerdown", flap);
  return;
}

/** Scene update step */
function update(time, delta) {
  totalDelta += delta;

  // Detect game over
  if (isGameLost()) restartRound();

  return;
}

////////////////////////////////////////////////////////////////////////////////
// END SCENE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

new Phaser.Game(config);
