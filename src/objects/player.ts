import { GameObjects, Physics, Scene } from 'phaser';

export class Player extends Physics.Arcade.Image {

  public static HORIZONTAL_VELOCITY = 400;
  public static JUMP_VELOCITY = 500;

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
  }

  public update({ time, delta, keyboard }) {
    const worldHeight = this.scene.physics.world.bounds.height;
    const altitude = (worldHeight - this.y - (this.displayHeight / 2));
    this.setData('altitude', Math.round(altitude));

    // console.log('Player::update', this.body.onFloor());

    if (keyboard.up.isDown && this.body.onFloor()) {
      this.setVelocityY(-(Player.JUMP_VELOCITY));
    }

    if (keyboard.left.isDown) {
      this.setVelocityX(-(Player.HORIZONTAL_VELOCITY));
    } else if (keyboard.right.isDown) {
      this.setVelocityX(Player.HORIZONTAL_VELOCITY);
    } else {
      this.setVelocityX(0);
    }
  }

  public handleStarCollision(star: GameObjects.GameObject) {
    star.destroy();
    this.setVelocityY(-(Player.JUMP_VELOCITY));
  }
}
