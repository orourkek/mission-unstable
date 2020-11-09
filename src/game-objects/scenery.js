import { GameObjects } from 'phaser';

export class Scenery extends GameObjects.Group {

  constructor(scene) {
    super(scene);

    scene.add.existing(this);

    this.createSky();
    this.createTrees();

    // const worldBounds = scene.physics.world.bounds;
    // this.setX(worldBounds.left);
    // this.setY(worldBounds.bottom);
  }

  createTrees() {
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

  createSky() {
    const worldBounds = this.scene.physics.world.bounds;
    const width = worldBounds.width;
    const height = (this.scene.cameras.main.height * 1.75);
    const texture = this.scene.textures.createCanvas(
      'skyGradient',
      width,
      height,
    );
    const context = texture.getContext();
    const grd = context.createLinearGradient(0, 0, 0, height);

    grd.addColorStop(0, 'rgba(77, 166, 255, 0)');
    grd.addColorStop(1/2, 'rgba(77, 166, 255, 0.9)');
    grd.addColorStop(1, 'rgba(77, 166, 255, 1)');

    context.fillStyle = grd;
    context.fillRect(0, 0, width, height);

    texture.refresh();

    this.sky = this.scene.add.image(
      worldBounds.left,
      worldBounds.bottom,
      'skyGradient'
    );
    this.sky.setOrigin(0, 1);

    this.add(this.sky);
  }

  update(time, delta) {}

}
