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
  public particleEmitter: GameObjects.Particles.ParticleEmitter;

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

    this.physics.add.collider(
      this.player,
      this.stars,
      // (player: Player, star: GameObjects.GameObject) => {
      //   star.destroy();
      //   player.setVelocityY(-(Player.JUMP_VELOCITY));
      // }
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

    const vSpacing = 180;
    const hSpacing = 800;
    let lastX = bounds.centerX;

    for (let y = (bounds.bottom - vSpacing); y > 0; y -= vSpacing) {
      const x = PhaserMath.RND.between(
        Math.max(0, (lastX - hSpacing / 2)),
        Math.min(bounds.width, (lastX + hSpacing / 2)),
      );
      lastX = x;
      group.create(x, y, 'star');
    }

    const particles = this.add.particles('star');
    // TODO: refactor emitter to avoid start/stop issues - attach to stars?
    this.particleEmitter = particles.createEmitter({
      on: false,
      speed: 150,
      alpha: { start: 1, end: 0 },
      scale: { start: 1, end: 0.2 },
      // accelerationX: -100,
      // accelerationY: -100,
      // angle: { min: -85, max: -95 },
      // rotate: { min: -180, max: 180 },
      lifespan: { min: 100, max: 500 },
      blendMode: 'ADD',
      // frequency: 110,
      // maxParticles: 10,
      x: 0,
      y: 0,
    });

    return group;
  }

  handleStarCollision(player: Player, star: GameObjects.GameObject) {
    this.particleEmitter.setPosition(
      star.body.position.x,
      star.body.position.y,
    );
    this.particleEmitter.start();
    this.time.delayedCall(100, () => this.particleEmitter.stop());
    star.destroy();
    player.setVelocityY(-(Player.STAR_JUMP_VELOCITY));
  }

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });

    this.bg.tilePositionX += this.player.body.deltaX() * 1;
    this.bg.tilePositionY += this.player.body.deltaY() * 1;
  }
}
