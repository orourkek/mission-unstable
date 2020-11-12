import { Physics, GameObjects, Math as PhaserMath, Scene } from 'phaser';

export class Stars extends Physics.Arcade.Group {

  private vSpacing = 80;
  private hSpacing = 800;

  private particles: GameObjects.Particles.ParticleEmitterManager;

  constructor(scene: Scene) {
    super(scene.physics.world, scene, {
      immovable: true,
      allowGravity: false,
    });

    this.particles = scene.add.particles('star');

    this.createStars();
  }

  public createStars() {
    const { bottom, width, centerX } = this.scene.physics.world.bounds;
    let lastX = centerX;

    for (let y = (bottom - this.vSpacing); y > 0; y -= this.vSpacing) {
      const x = PhaserMath.RND.between(
        Math.max(0, (lastX - this.hSpacing / 2)),
        Math.min(width, (lastX + this.hSpacing / 2)),
      );
      lastX = x;
      this.create(x, y, 'star');
    }
  }

  public handleStarCollision(star: GameObjects.GameObject) {
    const { x, y } = star.body.position;
    this.remove(star, true, true);
    const emitter = this.particles.createEmitter({
      on: true,
      speed: 150,
      alpha: { start: 0.6, end: 0 },
      scale: { start: 0.8, end: 0.2 },
      lifespan: { min: 150, max: 250 },
      blendMode: 'ADD',
      // frequency: 10,
      x,
      y,
    });

    this.scene.time.delayedCall(300, () => emitter.remove());
  }
}
