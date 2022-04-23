import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
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

  return;
}

let bird = null;
let totalDelta = null;
const VELOCITY = -200;

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);

  this.input.keyboard.on("keydown_SPACE", flap);
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

new Phaser.Game(config);
