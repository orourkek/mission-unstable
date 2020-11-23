import { Physics, GameObjects, Scene } from 'phaser';

export class Ground extends Physics.Arcade.Group {

  private ground: GameObjects.TileSprite;
  private background: GameObjects.Graphics;

  constructor(scene: Scene) {
    super(scene.physics.world, scene, {
      immovable: true,
      allowGravity: false,
    });

    const worldBounds = this.scene.physics.world.bounds;
    const groundHeight = 200; // approximation =(

    this.background = scene.add.graphics();
    this.background.fillStyle(0x2d1933, 1);
    this.background.fillRect(
      worldBounds.left,
      worldBounds.bottom,
      worldBounds.width,
      groundHeight,
    );

    this.ground = this.scene.add.tileSprite(
      worldBounds.left,
      worldBounds.bottom,
      worldBounds.width,
      32,
      'ground',
    );
    this.ground.setOrigin(0, 0);
    this.ground.setScale(2);
    this.add(this.ground);
  }
}
