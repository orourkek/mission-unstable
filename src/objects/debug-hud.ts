import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class DebugHUD extends GameObjects.Container {

  public scene: MainScene;

  private text: GameObjects.Text;

  public constructor(scene: Scene) {
    super(scene, 16, 16);

    this.text = this.scene.add.text(0, 0, '', {
      fontSize: '16px',
      padding: { x: 8, y: 4 },
      backgroundColor: '#000000AA',
      fill: '#ffffff',
    });

    this.add(this.text);
    this.setScrollFactor(0);
    scene.add.existing(this);
  }

  public update({ time, delta }) {
    const player = this.scene.player;
    const velocity = player.body.velocity;
    const drag = player.body.drag;
    const fmt = (str: string) => str.padEnd(36);
    const toFixed = (num: number, digits = 3) => {
      const factor = Math.pow(10, digits);
      return (Math.round(num * factor) / factor);
    };

    this.text.setText([
      fmt(`Position: { x: ${Math.round(player.x)}, y: ${Math.round(player.y)} }`),
      fmt(`Speed: ${toFixed(player.body.speed)}`),
      fmt(`Velocity: { x: ${toFixed(velocity.x)}, y: ${toFixed(velocity.y)} }`),
      fmt(`Drag: { x: ${toFixed(drag.x)}, y: ${toFixed(drag.y)} }`),
      fmt(`Altitude: ${player.altitude}`),
      fmt(`Player object count: ${player.length}`),
    ].join('\n'));
  }
}
