import { Physics, GameObjects, Scene } from 'phaser';

export class Ground extends GameObjects.Group {

  private groundHeight = 500;
  private dirt: GameObjects.Rectangle;

  constructor(scene: Scene) {
    super(scene);

    // const bounds = scene.physics.world.bounds;

    // this.dirt = scene.add.rectangle(
    //   bounds.centerX,
    //   bounds.bottom + (this.groundHeight / 2),
    //   bounds.width,
    //   this.groundHeight,
    //   0x3e2723,
    // );
    this.dirt = scene.add.rectangle(
      0,
      0,
      500,
      this.groundHeight,
      0x3e2723,
    );
    this.add(this.dirt);
  }
}
