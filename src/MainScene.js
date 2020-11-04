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
  }

  update() {
    if (this.movementKeys.up.isDown) {
      this.ship.thrusterUp();
    } else {
      this.ship.thrusterOff();
    }

    if (this.movementKeys.left.isDown) {
      this.ship.thrusterLeft();
    } else if (this.movementKeys.right.isDown) {
      this.ship.thrusterRight();
    } else {
      this.ship.thrusterOff();
    }
  }
}
