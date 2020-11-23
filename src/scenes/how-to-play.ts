import { Scene, GameObjects } from 'phaser';

export class HowToPlay extends Scene {

  constructor() {
    super('HowToPlay');
  }

  public create() {
    const { width, height, centerX, centerY } = this.cameras.main;

    const background = this.add.rectangle(
      0,
      0,
      width,
      height,
      0x322947,
      1
    ).setOrigin(0, 0);

    const text = (x: number, y: number, t: string, s: number) => {
      return this.add.text(x, y, t)
        .setFontFamily('"Press Start 2P"')
        .setFontSize(s)
        .setOrigin(0.5, 0.5);
    };

    const title = this.add.text(centerX, 64, 'HOW TO PLAY:')
      .setFontFamily('"Press Start 2P"')
      .setFontSize(48)
      .setOrigin(0.5, 0.5);

    const howTo = [
      '🚀 Reach for the stars...',
      '🚀 Use [W] to launch, [A] & [D] to move',
      '🚀 Avoid asteroids - they will stick',
      '🚀 Hit a satellite to shed stuck asteroids',
      '🚀 Don\'t hit satellites with your ship',
    ];

    const instructions = this.add.text(centerX, 128, howTo.join('\n'))
      .setFontFamily('"Press Start 2P"')
      .setLineSpacing(16)
      .setFontSize(16)
      .setOrigin(0.5, 0);

    this.add.text(centerX, height - 64, 'Press any key to start')
      .setFontFamily('"Press Start 2P"')
      .setFontSize(24)
      .setOrigin(0.5, 0.5);

    this.input.keyboard.once('keydown', this.startGame, this);
  }

  startGame() {
    this.scene.transition({ target: 'MainScene', duration: 500 });
  }
}
