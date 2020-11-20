import { GameObjects } from 'phaser';
import { MainScene } from '../../scenes/main-scene';
import { PitchIndicator } from './pitch';
import { WeightDistributionIndicator } from './weight-distribution';

export class HUD {

  public padding = 16;
  public scene: MainScene;

  public pitchIndicator: PitchIndicator;
  public weightDistributionIndicator: WeightDistributionIndicator;

  constructor(scene: MainScene) {
    this.scene = scene;

    const camera = this.scene.cameras.main;
    const left = camera.centerX - (camera.width / 2) + this.padding;
    const bottom = camera.height - this.padding;

    this.pitchIndicator = new PitchIndicator(this.scene, left, bottom);
    this.weightDistributionIndicator = new WeightDistributionIndicator(
      this.scene,
      (left + this.pitchIndicator.displayWidth),
      bottom,
    );
  }

  public update() {
    this.pitchIndicator.update();
    this.weightDistributionIndicator.update();
  }
}
