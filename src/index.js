import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import { MainScene } from './MainScene';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  scene: MainScene,
};

const game = new Phaser.Game(gameConfig);
