import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);

    this.CONFIG = config;
    this.SCREEN_CENTER = [config.width / 2, config.height / 2];
    this.MENU_CONFIG = {
      lineHeight: 42,
      fontOptions: { fontSize: "32px", fill: "#fff" },
      hoverFontOptions: {
        fontSize: "32px",
        fontWeight: "bold",
        fill: "#ffff00",
      },
    };
  }

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  ////////////////////////////////////////////////////////////////////////////
  // END SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////

  /** Create a GUI menu */
  createMenu(menu) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem) => {
      // Menu item positioning
      const menuItemPosition = [
        this.SCREEN_CENTER[0],
        this.SCREEN_CENTER[1] + lastMenuPositionY,
      ];
      lastMenuPositionY += this.MENU_CONFIG.lineHeight;

      // Create menu item
      const newMenuItem = this.add
        .text(...menuItemPosition, menuItem.text, this.MENU_CONFIG.fontOptions)
        .setOrigin(0.5, 1)
        .setInteractive();

      // On click event
      newMenuItem.on("pointerdown", () => {
        menuItem.scene && this.scene.start(menuItem.scene);
      });

      // On hover event
      newMenuItem.on("pointerover", () => {
        newMenuItem.setFill(this.MENU_CONFIG.hoverFontOptions.fill);
      });

      // Off hover event
      newMenuItem.on("pointerout", () => {
        newMenuItem.setFill(this.MENU_CONFIG.fontOptions.fill);
      });
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  // END GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////
}

export default BaseScene;