import { GameObjects } from 'phaser';
import { MainScene } from '../../scenes/main-scene';
import { PitchIndicator } from './pitch';
import { WeightDistributionIndicator } from './weight-distribution';

export class HUD {

  public scene: MainScene;

  public pitchIndicator: PitchIndicator;
  public weightDistributionIndicator: WeightDistributionIndicator;

  constructor(scene: MainScene) {
    this.scene = scene;
    this.pitchIndicator = new PitchIndicator(this.scene);
    this.weightDistributionIndicator = new WeightDistributionIndicator(
      this.scene,
      this.pitchIndicator.displayWidth,
    );
  }

  public update() {
    this.pitchIndicator.update();
    this.weightDistributionIndicator.update();
  }
}
