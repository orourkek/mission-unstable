import { Scene } from 'phaser';
import shipImg from './assets/ship.png';
import { Ship } from './game-objects/ship';

export class MainScene extends Scene {
  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('ship', shipImg);
  }

  create() {
    this.createShip();
    // this.cameras.main.startFollow(this.ship);
    this.movementKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  createShip() {
    this.ship = new Ship(this);
    // this.ship.setAngle()
  }

  update() {
    console.log(`ship rotation: ${this.ship.rotation}`);
    if (this.movementKeys.up.isDown) {
      // this.ship.setY(this.ship.y - 1);
      // this.ship.setVelocityY(-100);
      this.physics.velocityFromRotation(
        this.ship.rotation,
        300,
        this.ship.body.acceleration
      );
    } else if (this.movementKeys.down.isDown) {
      this.physics.velocityFromRotation(
        this.ship.rotation,
        -300,
        this.ship.body.acceleration
      );
    } else {
      // this.ship.setVelocityY(0);
      this.ship.setAcceleration(0);
    }

    if (this.movementKeys.left.isDown) {
      this.ship.setAngularVelocity(-150);
    } else if (this.movementKeys.right.isDown) {
      this.ship.setAngularVelocity(150);
    } else {
      this.ship.setAngularVelocity(0);
    }
  }
}
