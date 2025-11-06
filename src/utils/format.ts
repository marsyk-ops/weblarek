import type { IProductApi } from '../types/index';

export function formatPrice(price: IProductApi['price']): string {
  if (price == null) return 'Недоступно';
  return `${new Intl.NumberFormat('ru-RU').format(price)} синапсов`;
}
