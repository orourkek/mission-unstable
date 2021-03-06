import { GameObjects, Math as PMath, Physics, Scene } from 'phaser';
import { Player } from '../objects/player';
import { Ground } from '../objects/ground';
import { Scenery } from '../objects/scenery';
import { Asteroid } from '../objects/asteroid';
import { DebugHUD } from '../objects/debug-hud';
import { checkOverlap } from '../util/overlap';
import { HUD } from '../objects/hud/hud';
import { Satellite } from '../objects/satellite';
import { MuteButton } from '../objects/mute-button';

export class MainScene extends Scene {

  public keyboard: {
    [k: string]: Phaser.Input.Keyboard.Key;
  };

  public bg: GameObjects.TileSprite;
  public muteButton: MuteButton;
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
      (gameWidth * 5),
      (gameHeight * 20) + 64,
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

    this.muteButton = new MuteButton(this);

    this.physics.add.overlap(
      this.player,
      this.asteroids,
      (player: Player, asteroid: Asteroid) => {
        if (checkOverlap(player.ship, asteroid)) {
          this.handleAsteroidCollision(asteroid);
        }
      }
    );

    this.physics.add.overlap(
      this.player,
      this.satellites,
      (player: Player, satellite: Satellite) => {
        if (checkOverlap(player.ship, satellite)) {
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

    if (this.player.body.onCeiling()) {
      this.gameOver('win', 'You reached all the way to the stars!');
      return;
    }

    const { angularVelocity, speed } = this.player.body;
    const { launched, altitude } = this.player;

    if (angularVelocity > 750 || angularVelocity < -750) {
      this.gameOver('lose', 'Your ship was spinning too fast');
      return;
    }

    if (launched && (altitude === 0) && (speed > 10)) {
      this.gameOver('lose', 'Your ship crashed into the ground');
      return;
    }

    this.bg.tilePositionX += this.player.body.deltaX() * 0.25;
    this.bg.tilePositionY += this.player.body.deltaY() * 0.25;
  }

  private handleAsteroidCollision(asteroid: Asteroid) {
    this.asteroids.remove(asteroid);
    this.player.subsumeAsteroid(asteroid);
    this.sound.play('collision', { volume: 0.4 });
    this.physics.add.overlap(
      asteroid,
      this.asteroids,
      (playerAsteroid: Asteroid, spaceAsteroid: Asteroid) => {
        if (checkOverlap(playerAsteroid, spaceAsteroid)) {
          this.handleAsteroidCollision(spaceAsteroid);
        }
      }
    );
    this.physics.add.overlap(
      asteroid,
      this.satellites,
      (playerAsteroid: Asteroid, satellite: Satellite) => {
        if (checkOverlap(playerAsteroid, satellite)) {
          this.sound.play('explosion', { volume: 0.5 });
          this.player.handleSatelliteCollision(playerAsteroid, satellite);
          asteroid.destroy();
          satellite.destroy();
        }
      }
    );
  }

  private createRandomAsteroids(): Asteroid[] {
    const vSpacing = 20;
    const hSpacing = 2000;
    const minAltitude = 600;
    const { bottom, width, height, centerX } = this.physics.world.bounds;
    const asteroids = [];
    const rX = () => PMath.RND.between(
      centerX - hSpacing,
      centerX + hSpacing
    );

    for (let y = (bottom - minAltitude); y > 0; y -= vSpacing) {
      asteroids.push(new Asteroid(this, rX(), y));

      // Semi-randomly add more asteroids at the same altitude, with the
      // chance of extras increasing as altitude gets closer to the top.
      if (y < 1000) {
        if (PMath.RND.pick([0, 1, 1, 1])) {
          // asteroids.push(new Asteroid(this, x, (y + vSpacing / 2), 40, 80));
          asteroids.push(new Asteroid(this, rX(), y, 60, 160));
          asteroids.push(new Asteroid(this, rX(), (y - vSpacing / 2), 60, 160));
        }
      } else if (y < 3000) {
        if (PMath.RND.pick([0, 1])) {
          asteroids.push(new Asteroid(this, rX(), y, 60));
          asteroids.push(new Asteroid(this, rX(), y, 40));
        }
      } else if (y < 6000) {
        if (PMath.RND.pick([0, 1])) {
          asteroids.push(new Asteroid(this, rX(), y));
          asteroids.push(new Asteroid(this, rX(), y));
        }
      } else if (y < 8000) {
        if (PMath.RND.pick([0, 0, 1])) {
          asteroids.push(new Asteroid(this, rX(), y));
        }
      }

      // lastX = x;
    }

    return asteroids;
  }

  private createRandomSatellites(): Satellite[] {
    const vSpacing = 75;
    const minAltitude = 1200;
    const { bottom, width, centerX } = this.physics.world.bounds;
    const satellites = [];

    for (let y = (bottom - minAltitude); y > 0; y -= vSpacing) {
      const x = PMath.RND.between(0, width);
      const velocity = (PMath.RND.between(20, 180) * PMath.RND.pick([ 1, -1 ]));
      satellites.push(new Satellite(this, { x, y, velocity }));
    }

    return satellites;
  }

  public gameOver(status: 'win' | 'lose', message = '') {
    this.sound.stopAll();
    this.scene.launch('GameOver', {
      status,
      message,
      altitude: this.player.altitude,
    }).bringToTop('GameOver');
    this.scene.pause();
  }
}
