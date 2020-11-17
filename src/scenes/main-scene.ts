import { GameObjects, Math as PMath, Physics, Scene } from 'phaser';
import shipImg from '../assets/rocket_32.png';
import treesImg from '../assets/trees.png';
import flareImg from '../assets/thruster-flare.png';
import backgroundImg from '../assets/space.png';
import spaceJunkImg from '../assets/space_junk_32.png';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { Scenery } from '../objects/scenery';
import { Asteroid } from '../objects/asteroid';
import { DebugHUD } from '../objects/debug-hud';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public ground: Ground;
  public scenery: Scenery;
  public player: Player;
  public debugHUD: DebugHUD;
  public asteroids: GameObjects.Group;

  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.image('ship', shipImg);
    this.load.image('flare', flareImg);
    this.load.image('background', backgroundImg);
    this.load.image('trees', treesImg);
    this.load.image('spaceJunk', spaceJunkImg);
  }

  create() {
    const gameWidth = parseInt(`${this.game.config.width}`);
    const gameHeight = parseInt(`${this.game.config.height}`);
    this.matter.world.setBounds(
      0,
      0,
      (gameWidth * 3),
      (gameHeight * 10),
    );

    this.cameras.main.setSize(gameWidth, gameHeight);

    // const bounds = this.matter.world.bounds;

    // this.bg = this.add.tileSprite(
    //   bounds.centerX,
    //   bounds.centerY,
    //   bounds.width * 2,
    //   bounds.height * 2,
    //   'background'
    // );
    // this.bg.setScrollFactor(0);
    // this.bg.setScale(0.5);

    this.ground = new Ground(this);
    // this.scenery = new Scenery(this);
    this.player = new Player(this);
    // this.asteroids = this.add.group(this.createRandomAsteroids());

    // this.matter.add.collider(this.player, this.ground);

    // this.matter.add.overlap(
    //   this.player,
    //   this.asteroids,
    //   (player: Player, asteroid: Asteroid) => {
    //     this.handleAsteroidCollision(asteroid);
    //   }
    // );

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
    (window as any).scene = this;
    (window as any).player = this.player;
  }

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });

    this.bg.tilePositionX += this.player.body.deltaX() * 1;
    this.bg.tilePositionY += this.player.body.deltaY() * 1;
  }

  // private handleAsteroidCollision(asteroid: Asteroid) {
  //   this.asteroids.remove(asteroid);
  //   this.player.subsumeAsteroid(asteroid);
  //   this.matter.add.overlap(
  //     asteroid,
  //     this.asteroids,
  //     (playerAsteroid: Asteroid, spaceAsteroid: Asteroid) => {
  //       this.handleAsteroidCollision(spaceAsteroid);
  //     }
  //   );
  // }

  // private createRandomAsteroids(): Asteroid[] {
  //   const vSpacing = 100;
  //   const hSpacing = 1000;
  //   const { bottom, width, centerX } = this.matter.world.bounds;
  //   const asteroids = [];
  //   let lastX = centerX;

  //   for (let y = (bottom - vSpacing); y > 0; y -= vSpacing) {
  //     const x = PMath.RND.between(
  //       Math.max(0, (lastX - hSpacing / 2)),
  //       Math.min(width, (lastX + hSpacing / 2)),
  //     );
  //     asteroids.push(new Asteroid(this, x, y));
  //     lastX = x;
  //   }

  //   return asteroids;
  // }
}
