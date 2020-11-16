import { Game, GameObjects, Physics, Scene } from 'phaser';
import shipImg from '../assets/rocket_32.png';
import treesImg from '../assets/trees.png';
import flareImg from '../assets/thruster-flare.png';
import backgroundImg from '../assets/space.png';
import spaceJunkImg from '../assets/space_junk_32.png';
// import { Ship } from '../objects/ship';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { Scenery } from '../objects/scenery';
import { SpaceJunk } from '../objects/space-junk';
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
  public spaceJunk: SpaceJunk;

  public spaceJunkCollider?: Physics.Arcade.Collider;

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
    this.spaceJunk = new SpaceJunk(this);

    this.physics.add.collider(this.player, this.ground);

    this.spaceJunkCollider = this.physics.add.collider(
      this.player,
      this.spaceJunk,
      (player: Player, junk: Physics.Arcade.Image) => {
        const relativePosition = {
          x: (junk.x - player.x),
          y: (junk.y - player.y),
        };

        console.log(`relativePosition:`, relativePosition);

        this.spaceJunk.remove(junk);
        player.add(junk);
        junk.setPosition(relativePosition.x, relativePosition.y);

        // this.physics.add.existing(junk);
        console.log(`new player bounds:`, player.getBounds());
      }
    );

    this.cameras.main.startFollow(this.player);
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

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });

    this.bg.tilePositionX += this.player.body.deltaX() * 1;
    this.bg.tilePositionY += this.player.body.deltaY() * 1;
  }
}
