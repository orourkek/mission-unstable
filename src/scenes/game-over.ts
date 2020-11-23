import { Scene, GameObjects } from 'phaser';

const enum GameEndStatus {
  Win = 'win',
  Lose = 'lose',
}

export class GameOver extends Scene {

  private status: GameEndStatus;
  private title: GameObjects.Text;
  private caption: GameObjects.Text;
  private background: GameObjects.Rectangle;

  private bgColor: Record<GameEndStatus, number> = {
    [GameEndStatus.Win]: 0x3d6e70,
    [GameEndStatus.Lose]: 0x964253,
  };

  private label: Record<GameEndStatus, string> = {
    [GameEndStatus.Win]: 'VICTORY!',
    [GameEndStatus.Lose]: 'GAME OVER',
  };

  constructor() {
    super('GameOver');
  }

  public preload() {
    this.load.webfont(
      'Press Start 2P',
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
    );
  }

  public init(data: any) {
    this.status = data.status || 'lose';
  }

  public create() {
    const { width, height } = this.cameras.main;

    this.background = this.add.rectangle(
      0,
      0,
      width,
      height,
      this.bgColor[this.status],
      0.9
    ).setOrigin(0, 0);

    this.title = this.add.text(400, 300, this.label[this.status])
      .setName('title')
      .setFontFamily('"Press Start 2P"')
      .setFontSize(64)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0);

    this.caption = this.add.text(400, 400, 'Press any key to restart')
      .setName('caption')
      .setFontFamily('"Press Start 2P"')
      .setFontSize(16)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setTint(0xdddddd);

    this.input.keyboard.once('keydown', this.restartGame, this);
  }

  restartGame() {
    this.scene.stop();
    this.scene.get('MainScene').scene.restart();
  }
}
