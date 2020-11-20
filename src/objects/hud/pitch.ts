import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../../scenes/main-scene';

export class PitchIndicator extends GameObjects.Group {

  public scene: MainScene;

  private indicator: GameObjects.Image;
  private gaugeFrame: GameObjects.Image;
  private label: GameObjects.Text;

  get displayWidth() {
    return this.gaugeFrame.displayWidth;
  }

  get displayHeight() {
    return this.gaugeFrame.displayHeight;
  }

  constructor(scene: Scene, left: number, bottom: number) {
    super(scene);

    this.indicator = this.scene.add.image(
      0,
      0,
      'gauges/pitchInner'
    ).setScale(2);

    this.gaugeFrame = this.scene.add.image(
      0,
      0,
      'gauges/pitchFrame'
    ).setScale(2);

    this.add(this.indicator);
    this.add(this.gaugeFrame);

    scene.add.existing(this);

    const { displayHeight, displayWidth } = this.gaugeFrame;
    const x = left + (displayWidth / 2);
    const y = bottom - (displayHeight / 2);

    this.gaugeFrame.setPosition(x, y).setScrollFactor(0);
    this.indicator.setPosition(x, y).setScrollFactor(0);

    this.label = this.scene.add.text(x, bottom, 'PITCH', {
      fontSize: '14px',
      fill: '#ffffff',
    }).setScrollFactor(0).setOrigin(0.5, 0);
    this.add(this.label);
  }

  public update() {
    const player = this.scene.player;
    this.indicator.setAngle(player.angle - player.BASE_ANGLE);
  }
}
