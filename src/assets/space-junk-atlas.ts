const frame = (name: string, row = 0, col = 0, size = 32) => ({
  filename: name,
  frame: { x: (col * size), y: (row * size), w: size, h: size },
  rotated: false,
  trimmed: false,
  spriteSourceSize: { x: 0, y: 0, w: size, h: size },
  sourceSize: { w: size, h: size },
  pivot: { x: 0.5, y: 0.5 }
});

export default ({
  textures: [
    {
      image: 'space-junk.png',
      size: {
        w: 512,
        h: 512
      },
      scale: 1,
      frames: [
        frame('kitchen-sink', 0, 0),
        frame('toaster', 0, 1),
        frame('coffee-cup', 0, 2),
        frame('teddy-bear', 0, 3),
        frame('clock', 0, 4),
        // frame('', 0, 5),
        // frame('', 0, 6),

        frame('petunias', 1, 0),
        // frame('', 1, 1),
        // frame('', 1, 2),
        frame('cupcake', 1, 3),
        // frame('', 1, 4),
        // frame('', 1, 5),
        // frame('', 1, 6),

        frame('barbell', 2, 0),
        // frame('', 2, 1),
        // frame('', 2, 2),
        // frame('', 2, 3),
        // frame('', 2, 4),
        // frame('', 2, 5),
        // frame('', 2, 6),
      ]
    }
  ]
});
