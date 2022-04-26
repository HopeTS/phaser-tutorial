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

    menu.forEach((menuItem, setupMenuEvents) => {
      // Menu item positioning
      const menuItemPosition = [
        this.SCREEN_CENTER[0],
        this.SCREEN_CENTER[1] + lastMenuPositionY,
      ];
      lastMenuPositionY += this.MENU_CONFIG.lineHeight;

      const menuItemGO = this.createMenuItem(menuItem, menuItemPosition);
    });
  }

  /** Create menu item game object */
  createMenuItem(menuItem, position) {
    // Create game object
    const menuItemGO = this.add
      .text(...position, menuItem.text, this.MENU_CONFIG.fontOptions)
      .setOrigin(0.5, 1);

    if (menuItem.defaultConfig) {
      menuItemGO.setInteractive();

      // On click event
      menuItemGO.on("pointerup", () => {
        menuItem.scene != null && this.scene.start(menuItem.scene);
      });

      // On hover event
      menuItemGO.on("pointerover", () => {
        menuItemGO.setFill(this.MENU_CONFIG.hoverFontOptions.fill);
      });

      // Off hover event
      menuItemGO.on("pointerout", () => {
        menuItemGO.setFill(this.MENU_CONFIG.fontOptions.fill);
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // END GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////
}

export default BaseScene;
