import { EventEmitter } from '../../utils/EventEmitter';
import { IProduct, IBuyer } from '../../types';

// Импортируем оригинальные модели из первого спринта — без изменений!
import { Catalog } from './Catalog';
import { Cart } from './Cart';
import { Customer } from './Customer';

export class AppState extends EventEmitter {
  // Храним экземпляры оригинальных моделей
  catalog: Catalog = new Catalog();
  cart: Cart = new Cart();
  customer: Customer = new Customer();

  // === Каталог ===
  setCatalogItems(items: IProduct[]): void {
    this.catalog.setItems(items);
    this.emit('items:changed', items);
  }

  selectItem(item: IProduct): void {
    this.catalog.setCurrentItem(item);
    this.emit('preview:changed', item);
  }

  // === Корзина ===
  addToCart(item: IProduct): void {
    this.cart.addToCart(item);
    this.emit('cart:changed', this.cart.getCartList());
  }

  removeFromCart(item: IProduct): void {
    this.cart.removeFromCart(item);
    this.emit('cart:changed', this.cart.getCartList());
  }

  // Вспомогательный метод: проверяет, есть ли товар в корзине
  hasInCart(id: string): boolean {
    return this.cart.getCartList().some((i) => i.id === id);
  }

  // Вспомогательный метод: проверяет, доступен ли товар (цена не null)
  isItemAvailable(id: string): boolean {
    const item = this.catalog.getItems().find(i => i.id === id);
    return item ? item.price !== null : false;
  }

  // Вспомогательный метод: проверяет, можно ли купить (в корзине И доступен)
  canBeBought(id: string): boolean {
    return this.hasInCart(id) || this.isItemAvailable(id);
  }

  // === Покупатель ===
  updateCustomer(data: Partial<IBuyer>): void {
    this.customer.setUser(data);
    this.emit('order:changed', this.customer.getUser());
  }

  // === Очистка заказа ===
  clearOrder(): void {
    this.cart.emptyCart();
    this.customer.clear();
    this.emit('order:cleared');
    this.emit('cart:changed', []);
  }

  // === Валидация (не в модели!) ===
  isOrderFirstStepValid(): boolean {
    const { payment, address } = this.customer.getUser();
    return !!payment && !!address;
  }

  isOrderSecondStepValid(): boolean {
    const { email, phone } = this.customer.getUser();
    return !!email && !!phone;
  }

  // === Получение данных для заказа ===
  getOrderData(): { items: string[]; total: number; buyer: IBuyer } {
    return {
      items: this.cart.getCartList().map(item => item.id),
      total: this.cart.getCartSum(),
      buyer: this.customer.getUser(),
    };
  }
}