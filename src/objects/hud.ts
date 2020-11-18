import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class HUD extends GameObjects.Container {

  public EDGE_OFFSET = 16;

  public scene: MainScene;

  private pitchInner: GameObjects.Image;
  private pitchOuter: GameObjects.Image;
  private weightDistribution: GameObjects.Image;

  public constructor(scene: Scene) {
    super(scene, 0, 0);

    this.createGauges();

    this.setScrollFactor(0);

    const bounds = this.getBounds();
    const cameraHeight = scene.cameras.main.height;

    this.setPosition(
      scene.cameras.main.centerX,
      (cameraHeight - (bounds.height / 2) - this.EDGE_OFFSET),
    );

    scene.add.existing(this);

    (window as any).hud = this;
  }

  public update({ time, delta }) {
    const player = this.scene.player;
    const { left, right } = player.attachedAsteroids;
    this.pitchInner.setAngle(player.angle - player.BASE_ANGLE);
  }

  private createGauges() {
    this.pitchInner = this.scene.add.image(
      0,
      0,
      'pitchIndicatorInner'
    ).setScale(2);
    this.pitchOuter = this.scene.add.image(
      0,
      0,
      'pitchIndicatorOuter'
    ).setScale(2);

    this.pitchInner.setScale(2);
    this.pitchOuter.setScale(2);

    this.weightDistribution = this.scene.add.image(
      0,
      0,
      'weightDistributionIndicator'
    ).setScale(2);

    this.add([
      this.pitchInner,
      this.pitchOuter,
      this.weightDistribution,
    ]);

    const cameraWidth = this.scene.cameras.main.width;
    const leftmostX = -(cameraWidth / 2) + this.EDGE_OFFSET;
    const pitchWidth = this.pitchInner.displayWidth;
    const weightDistributionWidth = this.weightDistribution.displayWidth;
    const pitchX = leftmostX + (pitchWidth / 2);
    const weightDistributionX = (
      pitchX + (pitchWidth / 2) + (weightDistributionWidth / 2)
    );

    this.pitchInner.setX(pitchX);
    this.pitchOuter.setX(pitchX);
    this.weightDistribution.setX(weightDistributionX);
  }
}
