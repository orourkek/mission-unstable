import { GameObjects } from 'phaser';

export class Scenery extends GameObjects.Group {

  constructor(scene) {
    const bounds = scene.physics.world.bounds;

    super(scene);

    scene.add.existing(this);

    this.createSky();
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

    grd.addColorStop(0, 'rgba(125, 225, 255, 0)');
    grd.addColorStop(1/2, 'rgba(125, 225, 255, 0.9)');
    grd.addColorStop(1, 'rgba(62, 191, 255, 1)');

    context.fillStyle = grd;
    context.fillRect(0, 0, width, height);

    texture.refresh();

    this.scene.add.image(
      worldBounds.left,
      worldBounds.bottom,
      'skyGradient'
    ).setOrigin(0, 1);
  }

  update(time, delta) {}

}
