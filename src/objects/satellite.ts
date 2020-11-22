import { Math as PMath, Physics, Scene } from 'phaser';

export class Satellite extends Physics.Arcade.Image {

  public BLAST_RADIUS = 64;

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  constructor(scene: Scene, { x = 0, y = 0, velocity = 0 }) {
    super(scene, x, y, 'satellite');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(91);
    this.body.setAllowGravity(false);
    this.body.setVelocityX(velocity);
    this.body.setCollideWorldBounds(true);
    this.body.setBounceX(1);
  }
}
