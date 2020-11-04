import { Scene } from 'phaser';
import shipImg from './assets/rocket_192.png';
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
  }

  createShip() {
    this.ship = new Ship(this);
    this.add.existing(this.ship);
  }
}
