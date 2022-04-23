import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    // General game metadata
    this.CONFIG = config;
    this.totalDelta = null;

    // Pipe config data
    this.FIRST_PIPE_HORIZONTAL_POSITION = 0;
    this.PIPE_VERTICAL_DISTANCE_RANGE = [140, 200];
    this.PIPE_HORIZONTAL_DISTANCE_RANGE = [400, 500];
    this.PIPE_HOLE_RANGE = [80, 420];
    this.PIPE_TO_PIPE_DISTANCE = 400;
    this.PIPE_VELOCITY = -250;
    this.PIPES_TO_RENDER = 4;

    // Bird config data
    this.BIRD_GRAVITY = 400;
    this.BIRD_FLAP_VELOCITY = -225;

    // Game state variables
    this.pipeHorizontalPosition = this.FIRST_PIPE_HORIZONTAL_POSITION;

    // Sprites
    this.bird = null;
    this.pipes = null;
  }

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  preload() {
    // Load images
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    // Set background
    this.add.image(0, 0, "sky").setOrigin(0);

    // Set up bird
    this.bird = this.physics.add
      .sprite(this.CONFIG.startPosition.x, this.CONFIG.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = this.BIRD_GRAVITY;

    // Set up pipes
    this.pipes = this.physics.add.group();

    for (let i = 0; i < this.PIPES_TO_RENDER; i++) {
      const uPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lPipe = this.pipes.create(0, 0, "pipe").setOrigin(0);

      this.placePipeSet(uPipe, lPipe);
    }

    this.pipes.setVelocityX(this.PIPE_VELOCITY);

    // Set control scheme
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
    this.input.on("pointerdown", this.flap, this);
  }

  update(time, delta) {
    this.totalDelta += delta;

    if (this.isGameLost()) this.restartRound();

    this.recyclePipes();
  }

  ////////////////////////////////////////////////////////////////////////////
  // END SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////

  /** Bird flapping wings */
  flap() {
    this.bird.body.velocity.y = this.BIRD_FLAP_VELOCITY;
  }

  /** Get horizontal position of farthest pipe */
  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(rightMostX, pipe.x);
    });

    return rightMostX;
  }

  /** Detect whether or not game has been lost */
  isGameLost() {
    // Did bird touch top or bottom of screen?
    if (this.bird.body.position.y <= 0 || this.bird.body.position.y >= 600) {
      return true;
    }

    // TODO: Detect bird collision with pipe
    return false;
  }

  /** Place a set of pipes on the canvas */
  placePipeSet(uPipe, lPipe) {
    // Get horizontal position
    const rightMostXPosition = this.getRightMostPipe();
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...this.PIPE_HORIZONTAL_DISTANCE_RANGE
    );
    this.pipeHorizontalPosition = rightMostXPosition + pipeHorizontalDistance;

    // Get vertical positions
    const pipeHole = Phaser.Math.Between(...this.PIPE_HOLE_RANGE);
    const pipeHoleSize = Phaser.Math.Between(
      ...this.PIPE_VERTICAL_DISTANCE_RANGE
    );
    const lPipeVerticalPosition = pipeHole + pipeHoleSize / 2;
    const uPipeVerticalPosition = pipeHole - pipeHoleSize / 2;

    // Set positions
    uPipe.x = this.pipeHorizontalPosition;
    uPipe.y = uPipeVerticalPosition;
    lPipe.x = this.pipeHorizontalPosition;
    lPipe.y = lPipeVerticalPosition;

    console.log("here are pipes now", uPipe, lPipe);
  }

  /** Recycle pipe set */
  recyclePipes() {
    // Get out of bounds pipes
    let upperPipe = null;
    let lowerPipe = null;
    this.pipes.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right <= 0) {
        if (pipe.originY === 1) upperPipe = pipe;
        else lowerPipe = pipe;
      }
    });

    if (!upperPipe || !lowerPipe) return;

    // Place pipes
    this.placePipeSet(upperPipe, lowerPipe);
  }

  /** Restart round (begin game / after loss) */
  restartRound() {
    // Reset player position
    this.bird.body.position.x = this.BIRD_STARTING_X;
    this.bird.body.position.y = this.BIRD_STARTING_Y;
    this.bird.body.velocity.y = 0;
  }

  ////////////////////////////////////////////////////////////////////////////
  // END GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////
}

export default PlayScene;
