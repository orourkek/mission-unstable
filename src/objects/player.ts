import { GameObjects, Physics, Scene } from 'phaser';
import { Asteroid } from './asteroid';
import { Ship } from './ship';

export class Player extends GameObjects.Container {

  // Amount of drag to be applied for each additional object in the container
  public readonly DRAG_FACTOR = 20;
  public readonly MAX_VELOCITY = 300;

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

    this.ship = new Ship(scene);
    this.add(this.ship);

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    // align to bottom edge
    this.setPosition(gameBounds.centerX, gameBounds.bottom);
    this.setDepth(100);
    this.setAngle(-90);
    this.body.setOffset(
      -(this.ship.displayWidth / 2),
      -(this.ship.displayHeight / 2),
    );

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(this.MAX_VELOCITY);
    // this.body.setAngularDrag(250);
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

    this.scene.physics.velocityFromAngle(
      this.angle,
      this.body.speed,
      this.body.velocity,
    );

    // if (keyboard.up.isDown) {
    //   this.scene.physics.velocityFromAngle(
    //     this.angle,
    //     400,
    //     this.body.velocity,
    //   );
    //   // this.body.setAccelerationY(this.escapeVelocity - 20);
    // } else if (keyboard.down.isDown) {
    //   // this.body.setAccelerationY(this.escapeVelocity + 20);
    // } else {
    //   this.body.setAcceleration(0, 0);
    // }

    if (keyboard.left.isDown) {
      // this.body.setAngularVelocity(-300);
      this.body.setAngularAcceleration(-150);
    } else if (keyboard.right.isDown) {
      // this.body.setAngularVelocity(300);
      this.body.setAngularAcceleration(150);
    } else {
      // this.body.setAngularVelocity(0);
      this.body.setAngularAcceleration(0);
    }

    this.ship.update({ time, delta, keyboard });

    this.body.setMaxVelocity(
      Math.max(0, (this.MAX_VELOCITY - (this.length * this.DRAG_FACTOR))),
      Math.max(0, (this.MAX_VELOCITY - (this.length * this.DRAG_FACTOR))),
    );
  }

  public doLaunch() {
    this.launched = true;
    this.body.setAccelerationY(this.escapeVelocity - 20);
  }

  public subsumeAsteroid(asteroid: Asteroid) {
    const offsetX = (asteroid.x - this.x);
    const offsetY = (asteroid.y - this.y);
    const sin = Math.sin(this.rotation);
    const cos = Math.cos(this.rotation);
    const relativeX = ((offsetY * sin) + (offsetX * cos));
    const relativeY = ((offsetY * cos) - (offsetX * sin));
    // console.log(`Asteroid coords: (${asteroid.x}, ${asteroid.y})`);
    // console.log(`Ship coords: (${this.x}, ${this.y})`);
    // console.log(`Relative coords: (${relativeX}, ${relativeY})`);

    asteroid.setPosition(relativeX, relativeY);
    this.add(asteroid);
  }
}
