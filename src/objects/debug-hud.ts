import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class DebugHUD extends GameObjects.Container {

  public scene: MainScene;

  private speed: number;
  private positionX: number;
  private positionY: number;
  private velocityX: number;
  private velocityY: number;
  private altitude: number;

  private text: GameObjects.Text;

  public constructor(scene: Scene) {
    super(scene, 16, 16);

    this.speed = 0;
    this.positionX = 0;
    this.positionY = 0;
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
      `Speed: ${this.speed}                                    `,
      `Position: { x: ${this.positionX}, y: ${this.positionY} }`,
      `Velocity: { x: ${this.velocityX}, y: ${this.velocityY} }`,
      `Altitude: ${this.altitude}                              `,
    ].join('\n');
  }

  public update({ time, delta }) {
    const player = this.scene.player;
    this.speed = this.toFixed(player.body.speed);
    this.positionX = Math.round(player.body.x);
    this.positionY = Math.round(player.body.y);
    this.velocityX = this.toFixed(player.body.velocity.x);
    this.velocityY = this.toFixed(player.body.velocity.y);
    this.altitude = player.getData('altitude');
    this.text.setText(this.getText());
  }

  private toFixed(num: number, digits = 3) {
    const factor = Math.pow(10, digits);
    return (Math.round(num * factor) / factor);
  }
}
