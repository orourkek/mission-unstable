import { Scene, GameObjects } from 'phaser';

const enum GameEndStatus {
  Win = 'win',
  Lose = 'lose',
}

export class GameOver extends Scene {

  private status: GameEndStatus;
  private message: string;
  private altitude: number;

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

  public init(data: any) {
    this.status = data.status || 'lose';
    this.message = data.message || '';
    this.altitude = data.altitude;
  }

  public create() {
    const { width, height, centerX, centerY } = this.cameras.main;

    this.add.rectangle(
      0,
      0,
      width,
      height,
      this.bgColor[this.status],
      0.9
    ).setOrigin(0, 0);

    this.add.text(centerX, centerY - 32, this.label[this.status])
      .setFontFamily('"Press Start 2P"')
      .setFontSize(64)
      .setOrigin(0.5, 0.5)
      .setColor('#ffffeb')
      .setShadow(8, 8, '#272736')
      .setScrollFactor(0, 0);

    if (this.message) {
      this.add.text(centerX, centerY + 64, this.message)
        .setFontFamily('"Press Start 2P"')
        .setFontSize(16)
        .setWordWrapWidth(width - 24)
        .setLineSpacing(8)
        .setAlign('center')
        .setOrigin(0.5, 0)
        .setColor('#ffe478')
        .setScrollFactor(0, 0);
    }


    const altitudeMsg = `Max altitude: ${this.altitude}`;
    this.add.text(centerX, height - 128, altitudeMsg)
      .setFontFamily('"Press Start 2P"')
      .setFontSize(24)
      .setAlign('center')
      .setOrigin(0.5, 0)
      .setColor('#c2c2d1')
      .setScrollFactor(0, 0);

    this.add.text(centerX, height - 64, 'Press [space] to restart')
      .setFontFamily('"Press Start 2P"')
      .setFontSize(24)
      .setOrigin(0.5, 0.5)
      .setColor('#ffffeb')
      .setScrollFactor(0, 0);

    this.input.keyboard.once('keydown-SPACE', this.restartGame, this);
  }

  restartGame() {
    this.scene.stop();
    this.scene.get('MainScene').scene.restart();
  }
}
