import type { IProductApi } from '../types';
import type { IEvents } from '../components/base/events';
import { ProductCard } from '../components/base/ProductCard';

export class CardView extends ProductCard {
  constructor(events: IEvents) {
    super('card-catalog', events);
  }

  render(product: IProductApi): HTMLElement {
    this.setProductInfo(product);
    
    return this.root;
  }
}
