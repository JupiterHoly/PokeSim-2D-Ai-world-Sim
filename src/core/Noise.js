export class Noise {
  constructor(random) {
    this.random = random;
    this.permutation = new Uint8Array(512);
    const base = new Uint8Array(256);
    for (let i = 0; i < 256; i += 1) {
      base[i] = i;
    }
    for (let i = 255; i >= 0; i -= 1) {
      const j = Math.floor(random.next() * (i + 1));
      const temp = base[i];
      base[i] = base[j];
      base[j] = temp;
    }
    for (let i = 0; i < 512; i += 1) {
      this.permutation[i] = base[i & 255];
    }
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  perlin2(x, y) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const topRight = this.permutation[this.permutation[xi + 1] + yi + 1];
    const topLeft = this.permutation[this.permutation[xi] + yi + 1];
    const bottomRight = this.permutation[this.permutation[xi + 1] + yi];
    const bottomLeft = this.permutation[this.permutation[xi] + yi];

    const u = this.fade(xf);
    const v = this.fade(yf);

    const x1 = this.lerp(
      u,
      this.grad(bottomLeft, xf, yf),
      this.grad(bottomRight, xf - 1, yf)
    );
    const x2 = this.lerp(
      u,
      this.grad(topLeft, xf, yf - 1),
      this.grad(topRight, xf - 1, yf - 1)
    );

    return (this.lerp(v, x1, x2) + 1) / 2;
  }
}
