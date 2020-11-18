import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class DebugHUD extends GameObjects.Container {

  public scene: MainScene;

  private enabled: boolean;
  private text: GameObjects.Text;

  public constructor(scene: Scene, enabled = false) {
    super(scene, 16, 16);

    this.enabled = enabled;

    this.text = this.scene.add.text(0, 0, '', {
      fontSize: '16px',
      padding: { x: 8, y: 4 },
      backgroundColor: '#000000AA',
      fill: '#ffffff',
    });

    this.add(this.text);
    this.setScrollFactor(0);

    if (this.enabled) {
      scene.add.existing(this);
    }
  }

  public update({ time, delta }) {
    if (!this.enabled) {
      return;
    }

    const player = this.scene.player;
    const velocity = player.body.velocity;
    const accel = player.body.acceleration;
    const drag = player.body.drag;
    const { left, right } = player.attachedAsteroids;
    const fmt = (str: string) => str.padEnd(36);
    const toFixed = (num: number, digits = 3) => {
      const factor = Math.pow(10, digits);
      return (Math.round(num * factor) / factor);
    };

    this.text.setText([
      fmt(`Altitude: ${player.altitude}`),
      fmt(`Attached asteroids: ${player.length} (left: ${left} right: ${right})`),
      fmt(`Position: { x: ${Math.round(player.x)}, y: ${Math.round(player.y)} }`),
      fmt(`Rotation: ${toFixed(player.rotation, 5)} (${Math.round(player.angle)})`),
      fmt(`Speed: ${toFixed(player.body.speed)}`),
      fmt(`Acceleration: { x: ${toFixed(accel.x)}, y: ${toFixed(accel.y)} }`),
      fmt(`Velocity: { x: ${toFixed(velocity.x)}, y: ${toFixed(velocity.y)} }`),
      fmt(`Angular Velocity: ${toFixed(player.body.angularVelocity)}`),
      fmt(`Angular Velocity Adjustment: ${toFixed(player.angularAccelerationAdjustment)}`),
      fmt(`Drag: { x: ${toFixed(drag.x)}, y: ${toFixed(drag.y)} }`),
      fmt(`Gravity: ${toFixed(this.scene.physics.world.gravity.y)}`),
    ].join('\n'));
  }
}
