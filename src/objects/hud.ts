import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class HUD extends GameObjects.Container {

  public EDGE_OFFSET = 16;

  public scene: MainScene;

  private text: GameObjects.Text;
  private pitchInner: GameObjects.Image;
  private pitchOuter: GameObjects.Image;

  public constructor(scene: Scene) {
    super(scene, 16, scene.cameras.main.height - 50);

    // this.text = this.scene.add.text(0, 0, 'THIS IS THE HUD', {
    //   fontSize: '16px',
    //   padding: { x: 8, y: 4 },
    //   backgroundColor: '#000000AA',
    //   fill: '#ffffff',
    // });

    // this.add(this.text);

    this.createPitchIndicator();

    this.setScrollFactor(0);

    const bounds = this.getBounds();
    const cameraHeight = scene.cameras.main.height;

    this.setPosition(
      this.EDGE_OFFSET + (bounds.width / 2),
      (cameraHeight - (bounds.height / 2) - this.EDGE_OFFSET),
    );

    scene.add.existing(this);
  }

  public update({ time, delta }) {
    const player = this.scene.player;
    const { left, right } = player.attachedAsteroids;
    this.pitchInner.setAngle(player.angle - player.BASE_ANGLE);
  }

  private createPitchIndicator() {
    this.pitchInner = this.scene.add.image(0, 0, 'pitchIndicatorInner');
    this.pitchOuter = this.scene.add.image(0, 0, 'pitchIndicatorOuter');

    this.pitchInner.setScale(2);
    this.pitchOuter.setScale(2);

    this.add([ this.pitchInner, this.pitchOuter ]);
  }
}
