import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      /*       gravity: {
        y: 300,
      }, */
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

function preload() {
  // Load images
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
  return;
}

// General game data
let totalDelta = null;

// Pipe config data
const PIPE_VERTICAL_DISTANCE_RANGE = [100, 200];
const PIPE_HORIZONTAL_DISTANCE = 400;
const PIPES_TO_RENDER = 4;
let bottomPipe = null;
let topPipe = null;

// Bird config data
let bird = null;
const VELOCITY = -225;

function create() {
  // Set scene
  this.add.image(0, 0, "sky").setOrigin(0);

  // Set bird
  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 400;

  // Set pipes (tutorial way - single pipe set)
  /*   bottomPipe = this.physics.add
    .sprite(400, pipeVerticalPosition, "pipe")
    .setOrigin(0, 0);
  topPipe = this.physics.add
    .sprite(400, bottomPipe.y - pipeVerticalDistance, "pipe")
    .setOrigin(0, 1); */

  // Set pipes (multiple)
  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    console.log("creating new pipe set");
    let pipeVerticalDistance = Phaser.Math.Between(
      ...PIPE_VERTICAL_DISTANCE_RANGE
    );
    let pipeVerticalPosition = Phaser.Math.Between(
      0 + 50,
      config.height - 50 - pipeVerticalDistance
    );
    bottomPipe = this.physics.add
      .sprite(i * PIPE_HORIZONTAL_DISTANCE + 400, pipeVerticalPosition, "pipe")
      .setOrigin(0, 0);
    topPipe = this.physics.add
      .sprite(
        i * PIPE_HORIZONTAL_DISTANCE + 400,
        bottomPipe.y - pipeVerticalDistance,
        "pipe"
      )
      .setOrigin(0, 1);

    topPipe.body.velocity.x = -200;
    bottomPipe.body.velocity.x = -200;
  }

  // Set pipes ( my way)
  /* const initialPipeHole = createPipeHole();
  bottomPipe1 = this.physics.add
    .sprite(config.width * 0.3, initialPipeHole - 50, "pipe")
    .setOrigin(0, 1);
  topPipe1 = this.physics.add
    .sprite(config.width * 0.3, initialPipeHole + 50, "pipe")
    .setOrigin(0, 0); */

  // Set controls
  this.input.keyboard.on("keydown_SPACE", flap);
  this.input.on("pointerdown", flap);
  return;
}

function update(time, delta) {
  totalDelta += delta;

  // Move bird back and forth
  /*   if (bird.body.position.x > config.width - bird.width) {
    bird.body.velocity.x = -200;
  } else if (bird.body.position.x < 0) {
    bird.body.velocity.x = 200;
  } */

  if (bird.body.position.y <= 0 || bird.body.position.y >= config.height) {
    restartPlayerPosition();
  }

  return;
}

function restartPlayerPosition() {
  bird.body.position.y = config.height / 2 - bird.height / 2;
  bird.body.velocity.y = 0;
  return;
}

function flap() {
  bird.body.velocity.y = VELOCITY;
  return;
}

function createPipeHole() {
  return Math.random() * (config.height - 200) + 100;
}

new Phaser.Game(config);
