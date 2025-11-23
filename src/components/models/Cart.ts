import { IProduct } from "../../types";
import { EventEmitter } from "../../utils/EventEmitter";

export class Cart extends EventEmitter {
  private items: IProduct[] = [];

  constructor() {
    super();
  }

  getCartList(): IProduct[] {
    return this.items;
  }

  addToCart(item: IProduct): void {
    this.items.push(item);
    this.emit('cart:changed', this.items);
  }

  removeFromCart(item: IProduct): void {
    this.items = this.items.filter(p => p.id !== item.id);
    this.emit('cart:changed', this.items);
  }

  emptyCart(): void {
    this.items = [];
    this.emit('cart:changed', this.items);
  }

  getCartSum(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCartCount(): number {
    return this.items.length;
  }

  getItemAvailability(id: string): boolean {
    return this.items.some(item => item.id === id && item.price !== null);
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}