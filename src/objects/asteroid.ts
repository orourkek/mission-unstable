import { Physics, Math as PMath, Scene } from 'phaser';
import { v4 } from 'uuid';

export class Asteroid extends Physics.Arcade.Image {

  public id: string;

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  constructor(scene: Scene, x = 0, y = 0, vMin = 10, vMax = 100) {
    super(scene, x, y, 'asteroid');

    this.id = v4();

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.body.setBounceX(1);
    this.setDepth(90);

    this.setVelocityX(
      PMath.RND.between(vMin, vMax) * PMath.RND.pick([ 1, -1 ])
    );
    this.setAngularVelocity(
      PMath.RND.between(5, 25) * PMath.RND.pick([ 1, -1 ])
    );
  }
}
