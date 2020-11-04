import { Scene } from 'phaser';
import shipImg from './assets/rocket_192.png';

export class MainScene extends Scene {
  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('ship', shipImg);
  }

  create() {
    this.createShip();
  }

  createShip() {
    const gameBounds = this.physics.world.bounds;
    this.ship = this.add.image(
      gameBounds.width / 2,
      gameBounds.height / 2,
      'ship'
    );

    this.ship.setScale(0.5);

    const shipHeight = this.ship.displayHeight;
    const shipWidth = this.ship.displayWidth;

    // place ship at bottom edge of the scene
    this.ship.setPosition(
      gameBounds.width / 2,
      gameBounds.height - (shipHeight / 2),
    );
  }
}
