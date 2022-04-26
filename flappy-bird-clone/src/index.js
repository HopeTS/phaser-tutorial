import Phaser from "phaser";
import {
  MenuScene,
  PlayScene,
  PreloadScene,
  ScoreScene,
  PauseScene,
} from "./scenes";

const WIDTH = 400;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };

/** Config object */
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

// Create scenes
const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map((Scene) => createScene(Scene));

/** Phaser game config */
const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
  },
  scene: initScenes(),
};

new Phaser.Game(config);
