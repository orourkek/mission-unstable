import Phaser from 'phaser';
import { MainScene } from './MainScene';
import { TitleScene } from './TitleScene';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#eeeeee',
  scene: [
    TitleScene,
    MainScene,
  ],
};

const game = new Phaser.Game(gameConfig);
