import { Geom } from 'phaser';

export function getOverlap(
  r1: Geom.Rectangle,
  r2: Geom.Rectangle,
): Geom.Rectangle | null {

  const x = Math.max(r1.x, r2.x);
  const xx = Math.min(r1.x + r1.width, r2.x + r2.width);

  if (xx < x) {
    return null;
  }

  const y = Math.max(r1.y, r2.y);
  const yy = Math.min(r1.y + r1.height, r2.y + r2.height);

  if (yy < y) {
    return null;
  }

  return new Geom.Rectangle(
    x,
    y,
    xx - x,
    yy - y,
  );
}

export function getOverlapArea(
  r1: Geom.Rectangle,
  r2: Geom.Rectangle,
): number {
  const overlap = getOverlap(r1, r2);
  return overlap ? Geom.Rectangle.Area(overlap) : 0;
}
