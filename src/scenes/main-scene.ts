import { GameObjects, Math as PMath, Physics, Scene } from 'phaser';
import shipImg from '../assets/ship.png';
import treesImg from '../assets/trees.png';
import flareImg from '../assets/rocket_flare.png';
import backgroundImg from '../assets/space.png';
import asteroidImg from '../assets/asteroid_32.png';
import pitchInnerImg from '../assets/gauges/pitch_inner.png';
import pitchFrameImg from '../assets/gauges/pitch_frame.png';
import wdFrameImg from '../assets/gauges/wd_frame.png';
import wdBgImg from '../assets/gauges/wd_bg.png';
import wdLineImg from '../assets/gauges/wd_line.png';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { Scenery } from '../objects/scenery';
import { Asteroid } from '../objects/asteroid';
import { DebugHUD } from '../objects/debug-hud';
import {
  WeightDistributionIndicator
} from '../objects/gauges/weight-distribution';
import { PitchIndicator } from '../objects/gauges/pitch';
import { getOverlap } from '../util/get-overlap';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public ground: Ground;
  public scenery: Scenery;
  public player: Player;
  public debugHUD: DebugHUD;
  public pitchIndicator: PitchIndicator;
  public weightDistributionIndicator: WeightDistributionIndicator;
  public asteroids: GameObjects.Group;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('ship', shipImg);
    this.load.image('flare', flareImg);
    this.load.image('background', backgroundImg);
    this.load.image('trees', treesImg);
    this.load.image('asteroid', asteroidImg);
    this.load.image('gauges/pitchInner', pitchInnerImg);
    this.load.image('gauges/pitchFrame', pitchFrameImg);
    this.load.image('gauges/wdFrame', wdFrameImg);
    this.load.image('gauges/wdBg', wdBgImg);
    this.load.image('gauges/wdLine', wdLineImg);
  }

  create() {
    const gameWidth = parseInt(`${this.game.config.width}`);
    const gameHeight = parseInt(`${this.game.config.height}`);
    this.physics.world.setBounds(
      0,
      0,
      (gameWidth * 3),
      (gameHeight * 20),
    );

    this.cameras.main.setSize(gameWidth, gameHeight);

    const bounds = this.physics.world.bounds;

    this.bg = this.add.tileSprite(
      bounds.left,
      bounds.top,
      bounds.width + this.cameras.main.width,
      bounds.height, // + this.cameras.main.height,
      'background'
    );
    this.bg.setScrollFactor(0);
    this.bg.setScale(0.5);

    this.ground = new Ground(this);
    this.scenery = new Scenery(this);
    this.player = new Player(this);
    this.asteroids = this.add.group(this.createRandomAsteroids());

    this.physics.add.collider(this.player, this.ground);

    this.physics.add.overlap(
      this.player,
      this.asteroids,
      (player: Player, asteroid: Asteroid) => {
        if (this.customOverlapCheck(player.ship, asteroid)) {
          this.handleAsteroidCollision(asteroid);
        }
      }
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

    this.pitchIndicator = new PitchIndicator(this);
    this.weightDistributionIndicator = new WeightDistributionIndicator(
      this,
      this.pitchIndicator.displayWidth,
    );

    // TODO: hide by default
    this.debugHUD = new DebugHUD(this, false);
    (window as any).scene = this;
    (window as any).player = this.player;
  }

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });
    this.pitchIndicator.update({ time, delta });
    this.weightDistributionIndicator.update({ time, delta });

    this.bg.tilePositionX += this.player.body.deltaX() * 1;
    this.bg.tilePositionY += this.player.body.deltaY() * 1;
  }

  private handleAsteroidCollision(asteroid: Asteroid) {
    this.asteroids.remove(asteroid);
    this.player.subsumeAsteroid(asteroid);
    this.physics.add.overlap(
      asteroid,
      this.asteroids,
      (playerAsteroid: Asteroid, spaceAsteroid: Asteroid) => {
        if (this.customOverlapCheck(playerAsteroid, spaceAsteroid)) {
          this.handleAsteroidCollision(spaceAsteroid);
        }
      }
    );
  }

  private createRandomAsteroids(): Asteroid[] {
    const vSpacing = 25;
    const hSpacing = 2000;
    const minAltitude = 600;
    const { bottom, width, centerX } = this.physics.world.bounds;
    const asteroids = [];
    let lastX = centerX;

    for (let y = (bottom - minAltitude); y > 0; y -= vSpacing) {
      const x = PMath.RND.between(
        Math.max(0, (lastX - hSpacing / 2)),
        Math.min(width, (lastX + hSpacing / 2)),
      );
      asteroids.push(new Asteroid(this, x, y));
      lastX = x;
    }

    return asteroids;
  }

  /**
   * Overlap check that allows a certain amount of overlap to
   * compensate for using AABB physics with rotated bodies.
   */
  private customOverlapCheck(
    obj1: GameObjects.Components.GetBounds,
    obj2: GameObjects.Components.GetBounds,
  ) {
    const obj1Bounds = obj1.getBounds();
    const obj2Bounds = obj2.getBounds();
    const overlap = getOverlap(obj1Bounds, obj2Bounds);

    if (!overlap) {
      return;
    }

    const overlapArea = overlap.width * overlap.height;
    // So far in this game all assets are square, but this math should allow
    // for non-square bounding boxes to still work with this function
    const obj1MaxDim = Math.max(obj1Bounds.height, obj1Bounds.width);
    const obj2MaxDim = Math.max(obj2Bounds.height, obj2Bounds.width);
    const minOverlap = ((obj1MaxDim * 1/4) * (obj2MaxDim * 1/4));
    // If overlap width|height is below minDimensions, consider it no overlap
    const minDimensions = Math.min((obj1MaxDim * 1/4), (obj2MaxDim * 1/4));

    if (overlapArea > minOverlap) {
      // console.log(`area=${overlapArea.toFixed(2)} (${overlap.width.toFixed(2)} * ${overlap.height.toFixed(2)})`);
      if (overlap.width > minDimensions && overlap.height > minDimensions) {
        // console.log('-----------------------------------------------------');
        return true;
      }
      // console.log('NOT ENOUGH OVERLAP YET');
    } else {
      // console.log(`area=${overlapArea.toFixed(2)} (${overlap.width.toFixed(2)} * ${overlap.height.toFixed(2)})`);
    }
    return false;
  }
}
