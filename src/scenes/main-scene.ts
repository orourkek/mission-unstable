import { GameObjects, Scene, Physics, Math as PhaserMath } from 'phaser';
import shipImg from '../assets/rocket_32.png';
import backgroundImg from '../assets/space.png';
import starImg from '../assets/star.png';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { DebugHUD } from '../objects/debug-hud';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public ground: Ground;
  public player: Player;
  public stars: Physics.Arcade.Group;
  public debugHUD: DebugHUD;

  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('player', shipImg);
    this.load.image('background', backgroundImg);
    this.load.image('star', starImg);
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
    this.player = new Player(this);

    this.stars = this.createStars();

    this.physics.add.collider(this.player, this.stars, (player, star) => {
      this.player.handleStarCollision(star);
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(0, 100);

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

  createStars() {
    const bounds = this.physics.world.bounds;

    const group = this.physics.add.group({
      // key: 'star',
      allowGravity: false,
      // repeat: 100,
      // setXY: {
      //   x: (PhaserMath.RND.between(bounds.left, bounds.right)),
      //   y: bounds.bottom,
      //   stepY: -200,
      // }
    });

    const vSpacing = 200;
    const hSpacing = 80;
    let lastX = bounds.centerX;

    for (let y = (bounds.bottom - vSpacing); y > 0; y -= vSpacing) {
      const x = PhaserMath.RND.between(
        Math.max(bounds.left, (lastX - hSpacing)),
        Math.min(bounds.left, (lastX + hSpacing)),
      );
      group.create(x, y, 'star');
    }

    return group;
  }

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });

    this.bg.tilePositionX += this.player.body.deltaX() * 1;
    this.bg.tilePositionY += this.player.body.deltaY() * 1;
  }
}
