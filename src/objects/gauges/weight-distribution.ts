import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../../scenes/main-scene';

export class WeightDistributionIndicator extends GameObjects.Group {

  public scene: MainScene;

  private frame: GameObjects.Image;
  private bg: GameObjects.Image;
  private indicator: GameObjects.Image;

  constructor(scene: Scene, xOffset = 0) {
    super(scene);

    this.bg = this.scene.add.image(0, 0, 'gauges/wdBg').setScale(2);
    this.indicator = this.scene.add.image(0, 0, 'gauges/wdLine').setScale(2);
    this.frame = this.scene.add.image(0, 0, 'gauges/wdFrame').setScale(2);

    this.add(this.bg);
    this.add(this.indicator);
    this.add(this.frame);

    scene.add.existing(this);

    const { displayHeight, displayWidth } = this.frame;
    const camera = this.scene.cameras.main;
    const absoluteLeft = camera.centerX - (camera.width / 2);
    const x = absoluteLeft + (displayWidth / 2) + xOffset + 16;
    const y = camera.height - (displayHeight / 2) - 16;

    this.bg.setScrollFactor(0).setPosition(x, y);
    this.indicator.setScrollFactor(0).setPosition(x, y);
    this.frame.setScrollFactor(0).setPosition(x, y);
  }

  public update({ time, delta }) {
    const { attachedAsteroids } = this.scene.player;
    const { centerX, width: frameWidth } = this.frame.getBounds();
    const min = -(frameWidth / 2) + 14;
    const max = (frameWidth / 2) - 14;
    const xAdjustment = 8 * (attachedAsteroids.right - attachedAsteroids.left);

    this.indicator.setX(
      centerX +
      (xAdjustment < min ? min : xAdjustment > max ? max : xAdjustment)
    );
  }
}
