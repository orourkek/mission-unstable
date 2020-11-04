import { GameObjects } from 'phaser';

export class Ship extends GameObjects.Image {

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'ship');
    const gameBounds = this.scene.physics.world.bounds;
    this.setScale(0.5);
    const shipHeight = this.displayHeight;
    this.setPosition(
      gameBounds.width / 2,
      gameBounds.height - (shipHeight / 2),
    );
  }
}
