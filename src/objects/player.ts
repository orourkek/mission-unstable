import { GameObjects, Math as PMath, Physics, Scene } from 'phaser';
import { Asteroid } from './asteroid';
import { Satellite } from './satellite';

export class Player extends GameObjects.Container {

  // Amount of drag to be applied for each additional object in the container
  public readonly DRAG_FACTOR = 25;
  public readonly MAX_VELOCITY = 275;
  public readonly ANGULAR_DRAG = 100;
  public readonly BASE_ANGULAR_ACCEL = 200;
  public readonly BASE_ANGLE = -90;

  public attachedAsteroids = {
    left: 0,
    right: 0,
  };

  public angularAccelerationAdjustment = 0;

  public launched = false;
  public altitude: number;
  public escapeVelocity: number;

  // Override body type to be dynamic (non-static)
  public body: Physics.Arcade.Body;

  public ship: GameObjects.Image;
  public thrusterParticles: GameObjects.Particles.ParticleEmitterManager;
  public thrusterEmitter: GameObjects.Particles.ParticleEmitter;

  public constructor(scene: Scene, x = 0, y = 0) {
    super(scene);

    const gameBounds = this.scene.physics.world.bounds;
    const gameConfig = this.scene.game.config;

    this.escapeVelocity = -(gameConfig.physics.arcade.gravity.y);

    this.ship = this.scene.add.image(x, y, 'ship').setScale(2);
    this.add(this.ship);

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    // align to bottom edge
    this.setPosition(gameBounds.centerX, gameBounds.bottom);
    this.setDepth(100);
    this.setAngle(this.BASE_ANGLE);
    this.body.setOffset(
      -(this.ship.displayWidth / 2),
      -(this.ship.displayHeight / 2),
    );

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(this.MAX_VELOCITY);
    this.body.setAngularDrag(this.ANGULAR_DRAG);

    this.setupThrusterParticles();
  }

  public update({ time, delta, keyboard }) {
    const worldHeight = this.scene.physics.world.bounds.height;
    const altitude = (worldHeight - this.y - (this.ship.displayHeight / 2));
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

    if (this.angle > 0) {
      // facing DOWN
      if (this.body.acceleration.y < 0) {
        this.body.setAccelerationY(0);
      }
    } else {
      // facing UP
      if (this.body.acceleration.y >= 0) {
        this.body.setAccelerationY(this.escapeVelocity - 20);
      }
    }

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

    this.angularAccelerationAdjustment = (
      -(this.DRAG_FACTOR * this.attachedAsteroids.left) +
      (this.DRAG_FACTOR * this.attachedAsteroids.right)
    );

    if (keyboard.left.isDown) {
      this.body.setAngularAcceleration(
        -(this.BASE_ANGULAR_ACCEL) + this.angularAccelerationAdjustment
      );
    } else if (keyboard.right.isDown) {
      this.body.setAngularAcceleration(
        this.BASE_ANGULAR_ACCEL + this.angularAccelerationAdjustment
      );
    } else {
      this.body.setAngularAcceleration(this.angularAccelerationAdjustment);
    }
  }

  public doLaunch() {
    this.launched = true;
    this.thrusterEmitter.start();
    this.body.setAccelerationY(this.escapeVelocity - 20);
  }

  public subsumeAsteroid(asteroid: Asteroid) {
    const offsetX = (asteroid.x - this.x);
    const offsetY = (asteroid.y - this.y);
    // This math compensates for the fact that if the player object
    // is rotated, the coordinate system is also rotated (e.g. if
    // player.rotation === -90, the y axis is left/right)
    const sin = Math.sin(this.rotation);
    const cos = Math.cos(this.rotation);
    const relativeX = ((offsetY * sin) + (offsetX * cos));
    const relativeY = ((offsetY * cos) - (offsetX * sin));
    // console.log(`Asteroid coords: (${asteroid.x}, ${asteroid.y})`);
    // console.log(`Ship coords: (${this.x}, ${this.y})`);
    // console.log(`Relative coords: (${relativeX}, ${relativeY})`);

    // TODO: this math assumes a player rotation of -90 (i.e. y axis rotated)
    if (relativeY < 0) {
      this.attachedAsteroids.left++;
    } else if (relativeY > 0) {
      this.attachedAsteroids.right++;
    } else {
      // TODO?
    }

    asteroid.setPosition(relativeX, relativeY);
    asteroid.setAngle(180 - Math.abs(Math.abs(this.angle - 0) - 180));
    asteroid.setVelocity(0, 0);
    asteroid.setAngularVelocity(0);
    this.add(asteroid);
  }

  public handleSatelliteCollision(asteroid: Asteroid, satellite: Satellite) {
    this.each((pObj: GameObjects.GameObject) => {
      if (!(pObj instanceof Asteroid)) {
        return;
      }
      // Ideally this calc would use satellite instead of playerAsteroid
      // but player object coordinates are in a different coord space
      // (local to player 0,0)
      const dist = PMath.Distance.Between(
        asteroid.x,
        asteroid.y,
        pObj.x,
        pObj.y,
      );
      if (dist < satellite.BLAST_RADIUS) {
        if (pObj.y < 0) {
          this.attachedAsteroids.left--;
        } else if (pObj.y > 0) {
          this.attachedAsteroids.right--;
        }
        pObj.destroy();
      }
    })
  }

  protected setupThrusterParticles() {
    this.thrusterParticles = this.scene.add.particles('flare');
    this.thrusterParticles.setDepth(this.depth - 1);
    this.thrusterEmitter = this.thrusterParticles.createEmitter({
      on: false,
      bounds: this.scene.physics.world.bounds,
      speed: 250,
      scale: { start: 1.5, end: 0.25 },
      angle: {
        onEmit: () => {
          var v = Phaser.Math.Between(-25, 25);
          return (this.angle - 180) + v;
        }
      },
      lifespan: {
        onEmit: () => {
          const maxSpeed = this.MAX_VELOCITY;
          const pctOfMax = PMath.Percent(this.body.speed, 0, maxSpeed);

          if (this.altitude < 50) {
            return 3000;
          }
          return 250 + ((1 - pctOfMax) * 100);
        }
      },
    }).startFollow(this);
  }
}
