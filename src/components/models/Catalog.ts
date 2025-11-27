import { IProduct } from "../../types";
import { EventEmitter } from "../../utils/EventEmitter";

/*Модель почти не изменилась — только добавлено наследование от EventEmitter и emit в методах изменения.*/ 
export class Catalog extends EventEmitter {
  private items: IProduct[] = [];
  private currentItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
    this.emit('items:changed', items);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct {
    const item = this.items.find(item => item.id === id);
    if (!item) throw new Error(`Товар по id ${id} не найден`);
    return item;
  }

  setCurrentItem(product: IProduct): void {
    this.currentItem = product;
    this.emit('preview:changed', product);
  }

  getCurrentItem(): IProduct | null {
    return this.currentItem;
  }
}