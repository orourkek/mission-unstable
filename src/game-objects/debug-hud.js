import { GameObjects } from 'phaser';

export class DebugHUD extends GameObjects.Container {

  constructor(scene) {
    super(scene, 16, 16);

    this.speed = 0;
    this.velocityX = 0;
    this.velocityY = 0;

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

  getText() {
    return [
      `Speed: ${this.speed}`,
      `Velocity: { x: ${this.velocityX}, y: ${this.velocityY} }`,
    ].join('\n');
  }

  update({ time, delta }) {
    const ship = this.scene.ship;
    this.speed = ship.body.speed.toFixed(4);
    this.velocityX = ship.body.velocity.x.toFixed(4);
    this.velocityY = ship.body.velocity.y.toFixed(4);
    this.text.setText(this.getText());
  }
}
