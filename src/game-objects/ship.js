import { GameObjects, Physics } from 'phaser';

export class Ship extends Physics.Arcade.Image {

  constructor(scene, x = 0, y = 0) {
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

  doLaunch() {
    this.setData('launched', true);
    this.setAccelerationY(this.getData('escapeVelocity') - 20);
  }

  update({ time, delta, keyboard }) {
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

  setupThrusterParticles() {
    const particles = this.scene.add.particles('flare');
    particles.setDepth(this.depth - 1);
    this.particleEmitter = particles.createEmitter({
      speed: 150,
      on: false,
      lifespan: {
        onEmit: (particle, key, t, value) => {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 500;
        }
      },
      // TODO: tweak math so vertical (UP) motion isn't transparent
      alpha: {
        onEmit: (particle, key, t, value) => {
          return Phaser.Math.Percent(this.body.speed, 0, 300);
        }
      },
      angle: {
        onEmit: (particle, key, t, value) => {
          var v = Phaser.Math.Between(-30, 30);
          return (this.angle - 180) + v;
        }
      },
      scale: { start: 0.7, end: 0.1 },
      x: 0,
      y: (this.displayHeight / 2) - 15,
      // blendMode: 'HARD_LIGHT'
    });

    this.particleEmitter.startFollow(this);
  }

  enableParticles() {
    this.particleEmitter.start();
  }

  disableParticles() {
    this.particleEmitter.stop();
  }

  thrusterRight() {
    this.setVelocityX(300);
  }

  thrusterLeft() {
    this.setVelocityX(-300);
  }

  thrusterOff() {
    this.setVelocityX(0);
  }
}
