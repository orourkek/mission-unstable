import { GameObjects, Scene } from 'phaser';
import { MainScene } from '../scenes/main-scene';

export class MuteButton extends GameObjects.Container {

  public scene: MainScene;

  private muted = false;

  private icon: GameObjects.Image;
  private mutedIndicator: GameObjects.Image;

  public constructor(scene: Scene) {
    super(scene, 0, 0);

    this.setScrollFactor(0);
    this.setDepth(1000);
    this.setAlpha(0.5);

    this.icon = this.scene.add.image(0, 0, 'mute-icon');
    this.mutedIndicator = this.scene.add.image(0, 0, 'mute-icon-x')
      .setVisible(false);

    this.add(this.icon);
    this.add(this.mutedIndicator);

    const camera = this.scene.cameras.main;

    this.setPosition(
      camera.width - this.icon.displayWidth,
      this.icon.displayHeight
    );
    this.setSize(this.icon.width, this.icon.height);
    this.setInteractive();
    this.on('pointerdown', this.onClick, this);

    scene.add.existing(this);
  }

  public onClick() {
    if (this.scene.sound.mute) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  public mute() {
    this.scene.sound.mute = true;
    this.mutedIndicator.setVisible(true);
  }

  public unmute() {
    this.scene.sound.mute = false;
    this.mutedIndicator.setVisible(false);
  }
}
