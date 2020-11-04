import { GameObjects, Physics } from 'phaser';

export class Ship extends Physics.Arcade.Image {

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'ship');
    const gameBounds = this.scene.physics.world.bounds;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setScale(0.5);
    const shipHeight = this.displayHeight;

    // align ship to bottom edge
    this.setPosition(
      gameBounds.width / 2,
      gameBounds.height - (shipHeight / 2),
    );

    // rotate so ship points up
    this.setAngle(-90);

    // other properties
    this.setCollideWorldBounds(true);
    // this.setDrag(300);
    // this.setAngularDrag(400);
    this.setMaxVelocity(300);
  }

  thrusterUp() {
    this.setVelocityY(-150);
  }

  thrusterRight() {
    this.setVelocityX(300);
  }

  thrusterLeft() {
    this.setVelocityX(-300);
  }

  thrusterOff() {
    this.setVelocityX(0);
    this.setAcceleration(0);
  }
}
