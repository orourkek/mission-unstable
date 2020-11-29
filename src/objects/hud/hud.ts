import { GameObjects } from 'phaser';
import { MainScene } from '../../scenes/main-scene';
import { PitchIndicator } from './pitch';
import { AltitudeIndicator } from './altitude';
import { WeightDistributionIndicator } from './weight-distribution';

export class HUD {

  public padding = 10;
  public scene: MainScene;

  public background: GameObjects.Rectangle;
  public pitchIndicator: PitchIndicator;
  public altitudeIndicator: AltitudeIndicator;
  public weightDistributionIndicator: WeightDistributionIndicator;

  constructor(scene: MainScene) {
    this.scene = scene;

    const camera = this.scene.cameras.main;
    const left = camera.centerX - (camera.width / 2);
    const bottom = camera.height;
    const depth = this.scene.player.depth + 2;

    this.pitchIndicator = new PitchIndicator(
      this.scene,
      (left + this.padding),
      (bottom - 2 * this.padding),
    ).setDepth(depth);

    this.weightDistributionIndicator = new WeightDistributionIndicator(
      this.scene,
      (left + (2 * this.padding) + this.pitchIndicator.displayWidth),
      (bottom - 2 * this.padding),
    ).setDepth(depth);

    this.altitudeIndicator = new AltitudeIndicator(
      this.scene,
      (this.weightDistributionIndicator.right + this.padding),
      (bottom - 2 * this.padding),
    ).setDepth(depth);

    const gaugeHeight = Math.max(
      this.pitchIndicator.displayHeight,
      this.weightDistributionIndicator.displayHeight,
      this.altitudeIndicator.displayHeight,
    );
    const bgHeight = gaugeHeight + (3 * this.padding);
    const bgWidth = (
      (4 * this.padding) +
      this.pitchIndicator.displayWidth +
      this.weightDistributionIndicator.displayWidth +
      this.altitudeIndicator.displayWidth
    );

    this.background = this.scene.add.rectangle(
      (left + bgWidth / 2),
      (bottom - bgHeight / 2),
      bgWidth,
      bgHeight,
      0x43434f,
    ).setScrollFactor(0).setDepth(depth - 1);
  }

  public update() {
    this.pitchIndicator.update();
    this.weightDistributionIndicator.update();
    this.altitudeIndicator.update();
  }
}
