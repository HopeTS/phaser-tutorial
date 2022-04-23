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

  // Load sprites
  this.load.image("bird", "assets/bird.png");
  return;
}

let bird = null;
let totalDelta = null;

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);

  return;
}

function update(time, delta) {
  totalDelta += delta;
  return;
}

new Phaser.Game(config);
