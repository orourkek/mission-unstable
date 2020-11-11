import { GameObjects, Physics, Scene } from 'phaser';

export class Player extends Physics.Arcade.Image {

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  public constructor(scene: Scene, x = 0, y = 0) {
    super(scene, x, y, 'player');
    const gameBounds = this.scene.physics.world.bounds;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setScale(2);

    // align to bottom edge
    this.setPosition(
      gameBounds.width / 2,
      gameBounds.height - (this.displayHeight / 2),
    );

    // rotate to point up
    this.setAngle(-90);

    // "z-index"
    this.setDepth(100);

    // other properties
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(300);
  }

  public update({ time, delta, keyboard }) {
    const worldHeight = this.scene.physics.world.bounds.height;
    const altitude = (worldHeight - this.y - (this.displayHeight / 2));
    this.setData('altitude', Math.round(altitude));
  }
}
