import { GameObjects, Physics, Scene } from 'phaser';

// export class Ship extends Physics.Arcade.Image {
export class Ship extends GameObjects.Image {

  private particleEmitter: GameObjects.Particles.ParticleEmitter;

  public constructor(scene: Scene, x = 0, y = 0) {
    super(scene, x, y, 'ship');

    // this.scene.add.existing(this);
    // this.scene.physics.add.existing(this);

    this.setScale(2);
    this.setAngle(-90);
    this.setOrigin(1, 0);

    // this.setCollideWorldBounds(true);
    // this.setMaxVelocity(300);

    this.setupThrusterParticles();
  }

  public update({ time, delta, keyboard }) {
    // TODO: disabled this particle logic because Ship
    //       no longer has a physics body (see Player)
    // if (this.body.velocity.y < 0) {
    //   this.enableParticles();
    // } else {
    //   this.disableParticles();
    // }
  }

  protected setupThrusterParticles() {
    const particles = this.scene.add.particles('flare');
    particles.setDepth(this.depth - 1);
    this.particleEmitter = particles.createEmitter({
      speed: 150,
      on: false,
      // lifespan: {
      //   onEmit: () => {
      //     return Phaser.Math.Percent(this.body.speed, 0, 300) * 1000;
      //   }
      // },
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
}
