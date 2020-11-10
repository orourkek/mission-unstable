import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class DebugHUD extends GameObjects.Container {

  public scene: MainScene;

  private speed: number;
  private velocityX: number;
  private velocityY: number;
  private altitude: number;

  private text: GameObjects.Text;

  public constructor(scene: Scene) {
    super(scene, 16, 16);

    this.speed = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.altitude = 0;

    this.text = this.scene.add.text(0, 0, this.getText(), {
      fontSize: '16px',
      padding: { x: 8, y: 4 },
      backgroundColor: '#000000AA',
      fill: '#ffffff',
    });

    this.add(this.text);
    this.setScrollFactor(0);
    scene.add.existing(this);
  }

  public getText() {
    return [
      `Speed: ${this.speed}`,
      `Velocity: { x: ${this.velocityX}, y: ${this.velocityY} }`,
      `Altitude: ${this.altitude}`,
    ].join('\n');
  }

  public update({ time, delta }) {
    const ship = this.scene.ship;
    this.speed = this.toFixed(ship.body.speed);
    this.velocityX = this.toFixed(ship.body.velocity.x);
    this.velocityY = this.toFixed(ship.body.velocity.y);
    this.altitude = ship.getData('altitude');
    this.text.setText(this.getText());
  }

  private toFixed(num: number, digits = 3) {
    const factor = Math.pow(10, digits);
    return (Math.round(num * factor) / factor);
  }
}
