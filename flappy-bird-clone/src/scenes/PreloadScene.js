import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");

    this.CONFIG = config;
  }

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  preload() {
    // Load images
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
  }

  create() {
    this.scene.start("MenuScene");
  }

  update() {}

  ////////////////////////////////////////////////////////////////////////////
  // END SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////
}

export default PreloadScene;
