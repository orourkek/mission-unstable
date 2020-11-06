import { Scene } from 'phaser';

export class TitleScene extends Scene {
  constructor(){
    super('TitleScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    this.title = this.add.text(400, 300, '<Insert Name Here>')
      .setName('title')
      .setFontSize(42)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0);

    this.caption = this.add.text(400, 400, 'PRESS ANY KEY TO START')
      .setName('caption')
      .setFontSize(18)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setTint(0xdddddd);

    this.input.keyboard.once('keydown', this.startGame, this);
  }

  startGame() {
    // this.scene.switch('MainScene');
    this.scene.start('MainScene');
  }
}
