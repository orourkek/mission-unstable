import { Scene, Cameras, GameObjects } from 'phaser';
import shipImg from '../assets/ship.png';
import treesImg from '../assets/trees.png';
import groundImg from '../assets/ground.png';
import mountainsImg from '../assets/mountains.png';
import sunsetImg from '../assets/sunset.png';
import flareImg from '../assets/rocket_flare.png';
import backgroundImg from '../assets/space.png';
import asteroidImg from '../assets/asteroid_32.png';
import satelliteImg from '../assets/satellite.png';
import pitchInnerImg from '../assets/gauges/pitch_inner.png';
import pitchFrameImg from '../assets/gauges/pitch_frame.png';
import wdFrameImg from '../assets/gauges/wd_frame.png';
import wdBgImg from '../assets/gauges/wd_bg.png';
import wdLineImg from '../assets/gauges/wd_line.png';
import launchMp3 from '../assets/audio/shuttle-launch.mp3';
import collisionMp3 from '../assets/audio/kick.mp3';
import explosionMp3 from '../assets/audio/space-explosion.mp3';
import winSound from '../assets/audio/win.mp3';
import loseSound from '../assets/audio/lose.mp3';

export class BootScene extends Scene {

  private progressBar: GameObjects.Graphics;
  private progressBox: GameObjects.Graphics;
  private progressBarLabel: GameObjects.Text;
  private assetText: GameObjects.Text;

  constructor() {
    super('Boot');
  }

  public preload() {
    const { width, height, centerX, centerY } = this.cameras.main;
    const loadingBarHeight = height / 8;
    const loadingBarWidth = width * (2/3);
    const framePadding = 8;

    this.cameras.main.setBackgroundColor(0x322947);

    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x473b78, 1);
    this.progressBox.fillRect(
      (centerX - loadingBarWidth / 2) - framePadding,
      (centerY - loadingBarHeight / 2) - framePadding,
      loadingBarWidth + (framePadding * 2),
      loadingBarHeight + (framePadding * 2)
    );

    this.progressBar = this.add.graphics();
    this.progressBar.fillStyle(0x3ca370, 1);

    const setProgressBar = (pct: number) => {
      this.progressBar.fillRect(
        (centerX - loadingBarWidth / 2),
        (centerY - loadingBarHeight / 2),
        loadingBarWidth * pct,
        loadingBarHeight
      );
    }

    this.progressBarLabel = this.make.text({
      x: centerX,
      y: centerY,
      text: 'Loading...',
      style: {
        font: '24px monospace',
        fill: '#ffffeb'
      }
    }).setOrigin(0.5, 0.5);

    this.assetText = this.make.text({
      x: centerX,
      y: centerY + loadingBarHeight,
      text: '',
      style: {
        font: '16px monospace',
        fill: '#c2c2d1'
      }
    }).setOrigin(0.5, 0.5);

    this.load.on('progress', setProgressBar);

    this.load.on('fileprogress', (file: any) => {
      this.assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      this.progressBarLabel.setText('Complete!');
      this.assetText.setText('Starting Game...');

      this.time.delayedCall(50, () => {
        this.scene.transition({
          target: 'HowToPlay',
          duration: 500,
        });
      });
    });

    this.load.image('ship', shipImg);
    this.load.image('flare', flareImg);
    this.load.image('background', backgroundImg);
    this.load.image('trees', treesImg);
    this.load.image('ground', groundImg);
    this.load.image('mountains', mountainsImg);
    this.load.image('sunset', sunsetImg);
    this.load.image('asteroid', asteroidImg);
    this.load.image('satellite', satelliteImg);
    this.load.image('gauges/pitchInner', pitchInnerImg);
    this.load.image('gauges/pitchFrame', pitchFrameImg);
    this.load.image('gauges/wdFrame', wdFrameImg);
    this.load.image('gauges/wdBg', wdBgImg);
    this.load.image('gauges/wdLine', wdLineImg);
    this.load.webfont(
      'Press Start 2P',
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
    );
    this.load.audio('shuttleLaunch', launchMp3);
    this.load.audio('collision', collisionMp3);
    this.load.audio('explosion', explosionMp3);
    this.load.audio('win', winSound);
    this.load.audio('lose', loseSound);
  }
}
