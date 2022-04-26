import Phaser from "phaser";

import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", config);
  }

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  preload() {}

  create() {
    super.create();

    // Create menu text
    this.menu = this.getMenu();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  update() {}

  ////////////////////////////////////////////////////////////////////////////
  // END SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////

  /** Create menu text/buttons */
  getMenu() {
    const highScore = this.getScore();

    return [
      {
        scene: null,
        text: `High score: ${highScore}`,
      },
      {
        scene: "MenuScene",
        text: "Back",
      },
    ];
  }

  /** Get high score */
  getScore() {
    const highScore = localStorage.getItem("highScore");
    return parseInt(highScore, 10) || 0;
  }

  /** Set up menu option events */
  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;

    // Score text
    if (!menuItem.scene) return;

    // Back to menu
    textGO.setInteractive();

    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });

    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  // END GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////
}

export default ScoreScene;
