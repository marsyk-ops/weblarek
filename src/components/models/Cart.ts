import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];

  /* Добавлен пустой конструктор (будет полезен позже)*/
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
    return this.items.reduce((sum, item) => {
      return sum + (item.price || 0);
    }, 0);
  }

  getCartCount(): number {
    return this.items.length;
  }

  /*Заменён на метод some — возвращает boolean напрямую*/
  getItemAvailability(id: string): boolean {
    return this.items.some(item => item.id === id && item.price !== null);
  }
}