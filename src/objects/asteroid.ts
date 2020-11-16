import { Physics, GameObjects, Scene } from 'phaser';

export class Asteroid extends Physics.Arcade.Image {

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  constructor(scene: Scene, x = 0, y = 0) {
    super(scene, x, y, 'spaceJunk');

    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }
}
