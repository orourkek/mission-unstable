import { Physics, Math as PMath, Scene } from 'phaser';

export class Asteroid extends Physics.Arcade.Image {

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  constructor(scene: Scene, x = 0, y = 0) {
    super(scene, x, y, 'asteroid');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.setDepth(90);

    this.setVelocityX(
      PMath.RND.between(10, 30) * PMath.RND.pick([ 1, -1 ])
    );
    this.setAngularVelocity(
      PMath.RND.between(5, 25) * PMath.RND.pick([ 1, -1 ])
    );
  }
}
