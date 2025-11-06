import type { IEvents } from '../components/base/events';
import type { BasketItem, IBasketState, ID, IProductApi } from '../types';

export class BasketModel {
  private items: BasketItem[] = [];

  constructor(private events: IEvents) {}

  get state(): IBasketState {
    return {
      items: this.items.slice(),
      total: this.items.reduce((sum, it) => sum + (it.price ?? 0), 0),
    };
  }

  has(id: ID) {
    return this.items.some(it => it.id === id);
  }

  add(product: IProductApi) {
    if (this.has(product.id)) return;
    const item: BasketItem = { id: product.id, title: product.title, price: product.price };
    this.items.push(item);
    this.emitUpdated();
  }

  remove(id: ID) {
    this.items = this.items.filter(it => it.id !== id);
    this.emitUpdated();
  }

  clear() {
    this.items = [];
    this.emitUpdated();
  }

  private emitUpdated() {
    this.events.emit('basket:updated', { state: this.state });
  }
}