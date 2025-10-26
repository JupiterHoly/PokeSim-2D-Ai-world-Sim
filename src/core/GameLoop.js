export class GameLoop {
  constructor({ update, render, context }) {
    this.update = update;
    this.render = render;
    this.context = context;
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1000 / 60;
    this.frame = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const step = (time) => {
      if (!this.running) return;
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.accumulator += delta;

      while (this.accumulator >= this.fixedDelta) {
        this.update(this.fixedDelta / 1000);
        this.accumulator -= this.fixedDelta;
      }

      this.render(this.context);
      this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  stop() {
    this.running = false;
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }
}
