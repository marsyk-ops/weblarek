type EventHandler = (...args: any[]) => void;

export class EventEmitter {
  private events: { [key: string]: EventHandler[] } = {};

  on(event: string, callback: EventHandler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }
}