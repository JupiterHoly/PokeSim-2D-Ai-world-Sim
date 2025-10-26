export class SaveSystem {
  constructor(key) {
    this.key = key;
    this.supported = typeof window !== 'undefined' && 'localStorage' in window;
  }

  load() {
    if (!this.supported) return null;
    const raw = window.localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn('[SaveSystem] Failed to parse save data', error);
      return null;
    }
  }

  save(data) {
    if (!this.supported) return;
    try {
      const payload = JSON.stringify(data);
      window.localStorage.setItem(this.key, payload);
    } catch (error) {
      console.warn('[SaveSystem] Failed to save data', error);
    }
  }
}
