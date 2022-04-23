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
    this.BIRD_FLAP_VELOCITY = -300;

    // Game state variables
    this.pipeHorizontalPosition = this.FIRST_PIPE_HORIZONTAL_POSITION;
    this.score = 0;
    this.scoreText = "";
    this.highScore = 0;
    this.highScoreText = "";

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
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createControls();
    this.createColliders();
    this.createScore();
    this.createHighScore();
  }

  update(time, delta) {
    this.totalDelta += delta;

    if (this.isGameLost()) this.gameOver();

    this.recyclePipes();
  }

  ////////////////////////////////////////////////////////////////////////////
  // END SCENE FUNCTIONS
  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  // BEGIN GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////

  /** Create scene background */
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  /** Create player bird */
  createBird() {
    this.bird = this.physics.add
      .sprite(this.CONFIG.startPosition.x, this.CONFIG.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = this.BIRD_GRAVITY;
    this.bird.setCollideWorldBounds(true);
  }

  /** Create colliders */
  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  /** Create control scheme */
  createControls() {
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
    this.input.on("pointerdown", this.flap, this);
  }

  /** Create high score text */
  createHighScore() {
    this.highScore = this.getHighScore();
    this.highScoreText = this.add.text(16, 48, `Best: ${this.highScore}`, {
      fontSize: "32px",
      fill: 0xaaaaaa,
    });
  }

  /** Create initial pipes */
  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < this.PIPES_TO_RENDER; i++) {
      const uPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0);
      this.placePipeSet(uPipe, lPipe);
    }

    this.pipes.setVelocityX(this.PIPE_VELOCITY);
  }

  /** Create score test */
  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: 0xffffff,
    });
  }

  /** Bird flapping wings */
  flap() {
    this.bird.body.velocity.y = this.BIRD_FLAP_VELOCITY;
  }

  /** Handle game over event */
  gameOver() {
    // Stop game
    this.physics.pause();
    this.bird.setTint(0xfa1010);

    // Save high score
    const oldHighScore = this.getHighScore();
    if (oldHighScore < this.highScore) {
      this.setHighScore();
    }

    // Restart game
    this.time.addEvent({
      delay: 1000,
      callback: () => this.scene.restart(),
      callbackScope: this,
      loop: false,
    });
  }

  /** Get high score from localStorage */
  getHighScore() {
    const highScoreText = localStorage.getItem("highScore");
    if (highScoreText) return parseInt(highScoreText, 10);
    else return 0;
  }

  /** Get horizontal position of farthest pipe */
  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(rightMostX, pipe.x);
    });

    return rightMostX;
  }

  /** Increase score */
  increaseScore() {
    // Current score
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    // Set high score (if applicable)
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreText.setText(`Best: ${this.highScore}`);
    }
  }

  /** Detect whether or not game has been lost */
  isGameLost() {
    // Did bird touch top or bottom of screen?
    if (
      this.bird.getBounds().bottom >= this.CONFIG.height ||
      this.bird.getBounds().top <= 0
    ) {
      return true;
    }
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
    this.increaseScore();
    this.placePipeSet(upperPipe, lowerPipe);
  }

  /** Set new high score in localStorage */
  setHighScore() {
    console.log("setting new high score");
    localStorage.setItem("highScore", this.highScore);
  }

  ////////////////////////////////////////////////////////////////////////////
  // END GAME LOGIC
  ////////////////////////////////////////////////////////////////////////////
}

export default PlayScene;
