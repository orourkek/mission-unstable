import { Scene, Display, GameObjects } from 'phaser';

export class TitleScene extends Scene {

  private title: GameObjects.Text;

  constructor(){
    super('TitleScene');
  }

  preload() {
    this.scene.launch('MainScene').sendToBack('MainScene').sleep('MainScene');
  }

  create() {
    const { width, height, centerX, centerY } = this.cameras.main;

    this.add.rectangle(
      0,
      0,
      width,
      height,
      0x322947,
      1
    ).setOrigin(0, 0);

    const color1 = new Display.Color(186, 97, 86);
    const color2 = new Display.Color(242, 166, 94);

    this.title = this.add.text(centerX, centerY, 'MISSION:\nUNSTABLE')
      .setFontFamily('"Press Start 2P"')
      .setAlign('center')
      .setFontSize(64)
      .setOrigin(0.5, 0.5)
      .setColor(color1.rgba)
      .setShadow(8, 8, '#272736');

    const tween = this.tweens.addCounter({
      from: 0,
      to: 100,
      yoyo: true,
      loop: -1,
      duration: 2000,
      onUpdate: () => {
        const color = Display.Color.Interpolate.ColorWithColor(
          color1,
          color2,
          50,
          tween.getValue()
        );
        this.title.setColor(Display.Color.ObjectToColor(color).rgba);
      }
    });

    this.add.text(centerX, height - 64, 'PRESS ANY KEY TO START')
      .setFontFamily('"Press Start 2P"')
      .setFontSize(18)
      .setOrigin(0.5, 0.5)
      .setColor('#ffffeb');

    this.input.keyboard.once('keydown', this.startGame, this);
  }

  startGame() {
    this.scene.start('HowToPlay');
  }
}
