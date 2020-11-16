import { GameObjects, Physics, Scene } from 'phaser';
import { Asteroid } from './asteroid';
import { Ship } from './ship';

export class Player extends GameObjects.Container {

  public launched = false;
  public altitude: number;
  public escapeVelocity: number;

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  public ship: Ship;
  public particleEmitter: GameObjects.Particles.ParticleEmitter;

  public constructor(scene: Scene, x = 0, y = 0) {
    super(scene);

    const gameBounds = this.scene.physics.world.bounds;
    const gameConfig = this.scene.game.config;

    this.escapeVelocity = -(gameConfig.physics.arcade.gravity.y);

    // align to bottom edge
    this.setPosition(gameBounds.centerX, gameBounds.bottom);
    this.setDepth(100);

    this.ship = new Ship(scene);
    this.add(this.ship);

    this.scene.add.existing(this);
    // this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(300);
  }

  public update({ time, delta, keyboard }) {
    const worldHeight = this.scene.physics.world.bounds.height;
    const altitude = (worldHeight - this.y - (this.displayHeight / 2));
    this.altitude = Math.round(altitude);

    if (!this.launched) {
      if (keyboard.space.isDown || keyboard.up.isDown) {
        this.doLaunch();
      }
      return;
    }

    if (keyboard.left.isDown) {
      this.body.setVelocityX(-300);
    } else if (keyboard.right.isDown) {
      this.body.setVelocityX(300);
    } else {
      this.body.setVelocityX(0);
    }

    this.ship.update({ time, delta, keyboard });
  }

  public doLaunch() {
    this.launched = true;
    this.body.setAccelerationY(this.escapeVelocity - 20);
  }

  public subsumeAsteroid(asteroid: Asteroid) {
    const relativeX = (asteroid.x - this.x);
    const relativeY = (asteroid.y - this.y);
    this.add(asteroid);
    asteroid.setPosition(relativeX, relativeY);
  }
}
