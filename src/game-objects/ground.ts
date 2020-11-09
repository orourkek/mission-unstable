import { Physics } from 'phaser';

export class Ground extends Physics.Arcade.Group {

  constructor(scene) {
    const bounds = scene.physics.world.bounds;

    super(scene.physics.world, scene, {
      immovable: true,
      allowGravity: false,
    });

    this.groundHeight = 500;
    this.dirt = scene.add.rectangle(
      bounds.centerX,
      bounds.bottom + (this.groundHeight / 2),
      bounds.width,
      this.groundHeight,
      0x3e2723,
    );
    this.add(this.dirt);
  }

  update(time, delta) {}

}
