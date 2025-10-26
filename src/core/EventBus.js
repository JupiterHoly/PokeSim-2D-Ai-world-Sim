export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const off = this.on(event, (payload) => {
      callback(payload);
      off();
    });
    return off;
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    listeners.delete(callback);
    if (!listeners.size) {
      this.listeners.delete(event);
    }
  }

  emit(event, payload) {
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    for (const callback of listeners) {
      callback(payload);
    }
  }
}
