import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../../scenes/main-scene';

export class PitchIndicator extends GameObjects.Group {

  public scene: MainScene;

  private indicator: GameObjects.Image;
  private gaugeFrame: GameObjects.Image;

  get displayWidth() {
    return this.gaugeFrame.displayWidth;
  }

  constructor(scene: Scene) {
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
    const camera = this.scene.cameras.main;
    const x = camera.centerX - (camera.width / 2) + (displayWidth / 2) + 16;
    const y = camera.height - (displayHeight / 2) - 16;

    this.gaugeFrame.setPosition(x, y).setScrollFactor(0);
    this.indicator.setPosition(x, y).setScrollFactor(0);
  }

  public update({ time, delta }) {
    const player = this.scene.player;
    this.indicator.setAngle(player.angle - player.BASE_ANGLE);
  }
}
