import Phaser from "phaser";

import BaseScene from "./BaseScene";

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    // General game metadata
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

  preload() {}

  create() {
    super.create();
    this.createBird();
    this.createPipes();
    this.createControls();
    this.createColliders();
    this.createScore();
    this.createHighScore();
    this.createPause();
    this.listenToEvents();
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

  /** Handle the resume game countdown timer */
  countDown() {
    this.initialTime--;
    this.countDownText.setText(`Fly in: ${this.initialTime}`);

    if (this.initialTime === 0) {
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
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
      fontSize: "16px",
      fill: 0xaaaaaa,
    });
  }

  /** Create pause button */
  createPause() {
    const pauseButton = this.add
      .image(this.CONFIG.width - 10, this.CONFIG.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on(
      "pointerdown",
      () => {
        this.pause();
      },
      this
    );

    console.log(pauseButton.on);
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

  /** Listen to scene events */
  listenToEvents() {
    if (this.pauseEvent) return;
    this.pauseEvent = this.events.on(
      "resume",
      () => {
        console.log("On resume");
        // Create countdown text
        this.initialTime = 3;
        this.countDownText = this.add
          .text(
            ...this.SCREEN_CENTER,
            "Fly in: " + this.initialTime,
            this.fontOptions
          )
          .setOrigin(0.5);

        // Set up countdown timer
        this.timedEvent = this.time.addEvent({
          delay: 1000,
          callback: this.countDown,
          callbackScope: this,
          loop: true,
        });
      },
      this
    );
  }

  /** Pause the game */
  pause() {
    this.scene.pause();
    this.physics.pause();
    this.scene.launch("PauseScene");
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
