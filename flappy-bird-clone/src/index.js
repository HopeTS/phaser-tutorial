import Phaser from "phaser";
import { MenuScene, PlayScene, PreloadScene } from "./scenes";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

/** Phaser game config */
const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
  },
  scene: [
    new PreloadScene(SHARED_CONFIG),
    new MenuScene(SHARED_CONFIG),
    new PlayScene(SHARED_CONFIG),
  ],
};

new Phaser.Game(config);
