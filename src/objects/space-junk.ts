import { Physics, GameObjects, Math as PhaserMath, Scene } from 'phaser';

export class SpaceJunk extends Physics.Arcade.Group {

  private vSpacing = 100;
  private hSpacing = 1000;

  constructor(scene: Scene) {
    super(scene.physics.world, scene, {
      immovable: true,
      allowGravity: false,
    });

    this.createObjects();

    console.debug(`Created ${this.children.entries.length} pieces of space junk`);
  }

  public createObjects() {
    const { bottom, width, centerX } = this.scene.physics.world.bounds;
    let lastX = centerX;

    for (let y = (bottom - this.vSpacing); y > 0; y -= this.vSpacing) {
      const x = PhaserMath.RND.between(
        Math.max(0, (lastX - this.hSpacing / 2)),
        Math.min(width, (lastX + this.hSpacing / 2)),
      );
      lastX = x;
      this.create(x, y, 'spaceJunk');
    }
  }
}
