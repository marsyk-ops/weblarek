import { IProduct } from "../../types";


export class Cart {
  private items: IProduct[] = [];

  constructor() {}

  getCartList(): IProduct[] {
    return this.items;
  }

  addToCart(item: IProduct): void {
    this.items.push(item);
  }

  removeFromCart(item: IProduct): void {
    this.items = this.items.filter(p => p.id !== item.id);
  }

  emptyCart(): void {
    this.items = [];
  }

  getCartSum(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCartCount(): number {
    return this.items.length;
  }
}