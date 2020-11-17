import Phaser from 'phaser';
import { MainScene } from './scenes/main-scene';
import { TitleScene } from './scenes/title-scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#0e1224',
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: {
        y: 300,
      },
    },
    arcade: {
      fps: 60,
      debug: true,
      gravity: {
        y: 300,
      },
    },
  },
  scene: [
    // TitleScene,
    MainScene,
  ],
};

const game = new Phaser.Game(gameConfig);
