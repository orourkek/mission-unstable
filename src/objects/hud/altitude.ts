import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../../scenes/main-scene';

export class AltitudeIndicator extends GameObjects.Group {

  public scene: MainScene;

  private text: GameObjects.Text;
  private label: GameObjects.Text;

  get displayWidth() {
    return this.text.displayWidth;
  }

  get displayHeight() {
    return this.text.displayHeight;
  }

  constructor(scene: Scene, left: number, bottom: number) {
    super(scene);

    this.text = this.scene.add.text(0, 0, ''.padStart(5, '0'), {
      fontSize: '24px',
      fill: '#ffffff',
    }).setOrigin(0.5, 0.5);

    this.add(this.text);

    scene.add.existing(this);

    const { displayHeight, displayWidth } = this.text;
    const x = left + (displayWidth / 2);
    const y = bottom - (displayHeight);

    this.text.setPosition(x, y).setScrollFactor(0);

    this.label = this.scene.add.text(x, bottom, 'ALTITUDE', {
      fontSize: '14px',
      fill: '#ffffff',
    }).setScrollFactor(0).setOrigin(0.5, 0);

    this.add(this.label);
  }

  public update() {
    const player = this.scene.player;
    this.text.setText(`${player.altitude}`.padStart(5, '0'));
  }
}
