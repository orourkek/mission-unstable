import { Scene } from 'phaser';
import shipImg from './assets/ship.png';
import flareImg from './assets/thruster-flare.png';
import backgroundImg from './assets/space.png';
import { Ship } from './game-objects/ship';

export class MainScene extends Scene {
  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('ship', shipImg);
    this.load.image('flare', flareImg);
    this.load.image('background', backgroundImg);
  }

  create() {
    const bounds = this.physics.world.bounds;
    this.bg = this.add.tileSprite(
      bounds.centerX,
      bounds.centerY,
      bounds.width * 2,
      bounds.height * 2,
      'background'
    );
    this.bg.setScrollFactor(0);
    this.bg.setScale(0.5);

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

    // TODO: move into Ship?
    if (this.ship.body.velocity.y < 0) {
      this.ship.enableParticles();
    } else {
      this.ship.disableParticles();
    }

    this.bg.tilePositionX += this.ship.body.deltaX() * 1;
    this.bg.tilePositionY += this.ship.body.deltaY() * 1;
  }
}
