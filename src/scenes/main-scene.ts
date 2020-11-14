import { GameObjects, Scene, Physics, Math as PhaserMath } from 'phaser';
import shipImg from '../assets/rocket_32.png';
import backgroundImg from '../assets/space.png';
import starImg from '../assets/star.png';
import dingMp3 from '../assets/audio/ding2.mp3';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { DebugHUD } from '../objects/debug-hud';
import { Stars } from '../objects/stars';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public ground: Ground;
  public player: Player;
  public stars: Stars;
  public debugHUD: DebugHUD;
  public particleEmitter: GameObjects.Particles.ParticleEmitter;

  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('player', shipImg);
    this.load.image('background', backgroundImg);
    this.load.image('star', starImg);
    this.load.audio('ding', dingMp3);
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
    this.stars = new Stars(this);

    this.physics.add.collider(
      this.player,
      this.stars,
      this.handleStarCollision.bind(this),
    );

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

  handleStarCollision(player: Player, star: GameObjects.GameObject) {
    this.stars.handleStarCollision(star);
    player.setVelocityY(-(Player.STAR_JUMP_VELOCITY));
  }

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });

    this.bg.tilePositionX += this.player.body.deltaX() * 1;
    this.bg.tilePositionY += this.player.body.deltaY() * 1;
  }
}
