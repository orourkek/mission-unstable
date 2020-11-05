import { Scene } from 'phaser';
import shipImg from './assets/ship.png';
import flareImg from './assets/thruster-flare.png';
import backgroundImg from './assets/space.png';
import { Ship } from './game-objects/ship';
import { Ground } from './game-objects/ground';

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
    this.physics.world.setBounds(
      0,
      0,
      (this.game.config.width * 3),
      (this.game.config.height * 10),
    );

    this.cameras.main.setSize(
      this.game.config.width,
      this.game.config.height,
    );

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

    this.ground = new Ground(this);
    this.ship = new Ship(this);

    this.physics.add.collider(this.ship, this.ground);

    this.cameras.main.startFollow(this.ship);
    this.cameras.main.followOffset.set(0, 100);

    this.keyboard = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time, delta) {
    this.ship.update(time, delta);

    this.bg.tilePositionX += this.ship.body.deltaX() * 1;
    this.bg.tilePositionY += this.ship.body.deltaY() * 1;
  }
}
