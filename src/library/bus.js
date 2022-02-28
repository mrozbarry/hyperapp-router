export class Bus {
  constructor() {
    this.messages = [];
    this.listeners = {};
  }

  listen(fn) {
    const id = Math.random().toString(36).slice(2);
    this.listeners[id] = fn;
    return () => {
      delete this.listeners[id];
    };
  }

  emit(message) {
    this.messages.push(message);
    const listeners = Object.values(this.listeners);
    while (listeners.length > 0 && this.messages.length > 0) {
      const msg = this.consume();
      listeners.forEach((fn) => fn(msg));
    }
    return this;
  }

  consume() {
    return this.messages.shift();
  }
}
