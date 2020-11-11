import { GameObjects, Physics, Scene } from 'phaser';

export class Ship extends Physics.Arcade.Image {

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  private particleEmitter: GameObjects.Particles.ParticleEmitter;

  public constructor(scene: Scene, x = 0, y = 0) {
    super(scene, x, y, 'ship');
    const gameBounds = this.scene.physics.world.bounds;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setScale(2);
    const shipHeight = this.displayHeight;

    // align ship to bottom edge
    this.setPosition(
      gameBounds.width / 2,
      gameBounds.height - (shipHeight / 2),
    );

    // rotate so ship points up
    this.setAngle(-90);

    // "z-index"
    this.setDepth(100);

    // other properties
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(300);

    this.setupThrusterParticles();

    this.setData('launched', false);
    this.setData(
      'escapeVelocity',
      -(this.scene.game.config.physics.arcade.gravity.y)
    );
  }

  public doLaunch() {
    this.setData('launched', true);
    this.setAccelerationY(this.getData('escapeVelocity') - 20);
  }

  public update({ time, delta, keyboard }) {
    const worldHeight = this.scene.physics.world.bounds.height;
    const altitude = (worldHeight - this.y - (this.displayHeight / 2));
    this.setData('altitude', Math.round(altitude));

    if (!this.getData('launched')) {
      if (keyboard.space.isDown || keyboard.up.isDown) {
        this.doLaunch();
      }
      return;
    }

    if (keyboard.left.isDown) {
      this.thrusterLeft();
    } else if (keyboard.right.isDown) {
      this.thrusterRight();
    } else {
      this.thrusterOff();
    }

    if (this.body.velocity.y < 0) {
      this.enableParticles();
    } else {
      this.disableParticles();
    }
  }

  protected setupThrusterParticles() {
    const particles = this.scene.add.particles('flare');
    particles.setDepth(this.depth - 1);
    this.particleEmitter = particles.createEmitter({
      speed: 150,
      on: false,
      lifespan: {
        onEmit: () => {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 1000;
        }
      },
      angle: {
        onEmit: () => {
          var v = Phaser.Math.Between(-45, 45);
          return (this.angle - 180) + v;
        }
      },
      scale: { start: 0.3, end: 0.025 },
      x: 0,
      y: (this.displayHeight / 2),
      // blendMode: 'HARD_LIGHT'
    });

    this.particleEmitter.startFollow(this);
  }

  protected enableParticles() {
    this.particleEmitter.start();
  }

  protected disableParticles() {
    this.particleEmitter.stop();
  }

  protected thrusterRight() {
    this.setVelocityX(300);
  }

  protected thrusterLeft() {
    this.setVelocityX(-300);
  }

  protected thrusterOff() {
    this.setVelocityX(0);
  }
}
