import Phaser from 'phaser';
import { MainScene } from './MainScene';
import { TitleScene } from './TitleScene';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#eeeeee',
  physics: {
    default: 'arcade',
    arcade: {
      fps: 60,
      debug: true,
      gravity: {
        y: 0,
      },
    },
  },
  scene: [
    TitleScene,
    MainScene,
  ],
};

const game = new Phaser.Game(gameConfig);
