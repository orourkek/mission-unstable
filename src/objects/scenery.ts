import { GameObjects, Scene, Textures } from 'phaser';

export class Scenery extends GameObjects.Group {

  private mountains: GameObjects.TileSprite;
  private trees: GameObjects.TileSprite;
  private sunset: GameObjects.TileSprite;
  private sky: GameObjects.Image;
  private skyTexture: Textures.CanvasTexture;

  constructor(scene: Scene) {
    super(scene);

    scene.add.existing(this);

    this.createMountains();
    this.createSunset();
    this.createTrees();

    this.sunset.setDepth(8);
    this.mountains.setDepth(9);
    this.trees.setDepth(10);
  }

  protected createMountains() {
    const worldBounds = this.scene.physics.world.bounds;
    this.mountains = this.scene.add.tileSprite(
      worldBounds.left,
      worldBounds.bottom,
      worldBounds.width,
      64,
      'mountains',
    );
    this.mountains.setOrigin(0, 1);
    this.mountains.setScale(3);
    this.add(this.mountains);
  }
  protected createSunset() {
    const worldBounds = this.scene.physics.world.bounds;
    this.sunset = this.scene.add.tileSprite(
      worldBounds.left,
      worldBounds.bottom - this.mountains.displayHeight / 2,
      worldBounds.width,
      256,
      'sunset',
    );
    this.sunset.setOrigin(0, 1);
    this.sunset.setScale(3);
    this.add(this.sunset);
  }

  protected createTrees() {
    const worldBounds = this.scene.physics.world.bounds;
    this.trees = this.scene.add.tileSprite(
      worldBounds.left,
      worldBounds.bottom,
      worldBounds.width,
      32,
      'trees',
    );
    this.trees.setOrigin(0, 1);
    this.trees.setScale(2);
    this.add(this.trees);
  }
}
