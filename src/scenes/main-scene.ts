import { GameObjects, Math as PMath, Physics, Scene } from 'phaser';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { Scenery } from '../objects/scenery';
import { Asteroid } from '../objects/asteroid';
import { DebugHUD } from '../objects/debug-hud';
import { getOverlap } from '../util/get-overlap';
import { HUD } from '../objects/hud/hud';
import { Satellite } from '../objects/satellite';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public ground: Ground;
  public scenery: Scenery;
  public player: Player;
  public debugHUD: DebugHUD;
  public hud: HUD;
  public asteroids: GameObjects.Group;
  public satellites: GameObjects.Group;

  constructor() {
    super('MainScene');
  }

  preload() {}

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
    this.bg.setScale(3);

    this.player = new Player(this);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(0, 100);
    // this.cameras.main.setDeadzone(0, 100);
    this.ground = new Ground(this);
    this.scenery = new Scenery(this);
    this.asteroids = this.add.group(this.createRandomAsteroids());
    this.satellites = this.add.group(this.createRandomSatellites());

    for (let i = 0; i < 1000; i += 50) {
      // this.add.sprite(
      //   bounds.centerX,
      //   bounds.height - i,
      //   'spaceJunk',
      //   PMath.RND.between(0, 48),
      // ).setDepth(99999);
      const frames = this.textures.get('spaceJunk').getFrameNames();
      this.add.image(
        bounds.centerX,
        bounds.height - i,
        'spaceJunk',
        PMath.RND.pick(frames),
      ).setDepth(99999);
    }

    // this.add.image(bounds.centerX, bounds.height - 100, 'spaceJunk', 'kitchen-sink').setDepth(99999);
    // this.add.image(bounds.centerX, bounds.height - 200, 'spaceJunk', 'petunias').setDepth(99999);
    // this.add.image(bounds.centerX, bounds.height - 300, 'spaceJunk', 'barbell').setDepth(99999);

    this.physics.add.overlap(
      this.player,
      this.asteroids,
      (player: Player, asteroid: Asteroid) => {
        if (this.customOverlapCheck(player.ship, asteroid)) {
          this.handleAsteroidCollision(asteroid);
        }
      }
    );

    this.physics.add.overlap(
      this.player,
      this.satellites,
      (player: Player, satellite: Satellite) => {
        if (this.customOverlapCheck(player.ship, satellite)) {
          this.gameOver('lose', 'Your ship collided with a satellite');
        }
      }
    );

    this.keyboard = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.hud = new HUD(this);

    // TODO: hide by default
    this.debugHUD = new DebugHUD(this, false);
    (window as any).scene = this;
    (window as any).player = this.player;

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  update(time: number, delta: number) {
    this.player.update({ time, delta, keyboard: this.keyboard });
    this.debugHUD.update({ time, delta });
    this.hud.update();

    const { angularVelocity, speed } = this.player.body;
    const { launched, altitude } = this.player;

    if (angularVelocity > 750 || angularVelocity < -750) {
      this.gameOver('lose', 'Your ship was spinning too fast');
    }

    if (launched && (altitude === 0) && (speed > 5)) {
      this.gameOver('lose', 'Your ship crashed into the ground');
    }

    this.bg.tilePositionX += this.player.body.deltaX() * 0.25;
    this.bg.tilePositionY += this.player.body.deltaY() * 0.25;
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
    this.physics.add.overlap(
      asteroid,
      this.satellites,
      (playerAsteroid: Asteroid, satellite: Satellite) => {
        if (this.customOverlapCheck(playerAsteroid, satellite)) {
          this.player.handleSatelliteCollision(playerAsteroid, satellite);
          asteroid.destroy();
          satellite.destroy();
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

  private createRandomSatellites(): Satellite[] {
    const vSpacing = 100;
    const minAltitude = 1000;
    const { bottom, width, centerX } = this.physics.world.bounds;
    const satellites = [];

    for (let y = (bottom - minAltitude); y > 0; y -= vSpacing) {
      const x = PMath.RND.between(0, width);
      const velocity = (PMath.RND.between(25, 200) * PMath.RND.pick([ 1, -1 ]));
      satellites.push(new Satellite(this, { x, y, velocity }));
    }

    return satellites;
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

  private overlapWithCustomCheck<
    T1 extends GameObjects.GameObject | GameObjects.Group,
    T2 extends GameObjects.GameObject | GameObjects.Group,
    CBArg1 = T1 extends GameObjects.Group ? GameObjects.GameObject : T1,
    CBArg2 = T2 extends GameObjects.Group ? GameObjects.GameObject : T2,
  >(obj1: T1, obj2: T2, callback: (a: CBArg1, b: CBArg2) => void) {
    this.physics.add.overlap(
      obj1,
      obj2,
      (first: any, second: any) => {
        if (this.customOverlapCheck(first, second)) {
          callback(first, second);
        }
      }
    );
  }

  public gameOver(status: 'win' | 'lose', message = '') {
    this.scene.launch('GameOver', { status, message }).bringToTop('GameOver');
    this.scene.pause();
  }
}
