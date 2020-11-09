import { GameObjects, Scene } from 'phaser';
import shipImg from '../assets/rocket_32.png';
import treesImg from '../assets/trees.png';
import flareImg from '../assets/thruster-flare.png';
import backgroundImg from '../assets/space.png';
import { Ship } from '../game-objects/ship';
import { Ground } from '../game-objects/ground';
import { Scenery } from '../game-objects/scenery';
import { DebugHUD } from '../game-objects/debug-hud';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public ground: Ground;
  public scenery: Scenery;
  public ship: Ship;
  public debugHUD: DebugHUD;

  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('ship', shipImg);
    this.load.image('flare', flareImg);
    this.load.image('background', backgroundImg);
    this.load.image('trees', treesImg);
  }

  create() {
    const gameWidth = parseInt(`${this.game.config.width}`);
    const gameHeight = parseInt(`${this.game.config.height}`);
    this.physics.world.setBounds(
      0,
      0,
      (gameWidth * 3),
      (gameHeight * 10),
    );

    this.cameras.main.setSize(gameWidth, gameHeight);

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

    this.scenery = new Scenery(this);

    this.keyboard = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    // TODO: hide by default
    this.debugHUD = new DebugHUD(this);
  }

  update(time, delta) {
    this.ship.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });

    this.bg.tilePositionX += this.ship.body.deltaX() * 1;
    this.bg.tilePositionY += this.ship.body.deltaY() * 1;
  }
}
