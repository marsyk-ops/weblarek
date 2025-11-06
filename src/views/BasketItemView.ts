import type { BasketItem } from '../types';
import type { IEvents } from '../components/base/events';
import { Component } from '../components/base/Component';
import { formatPrice } from '../utils/format';

export class BasketItemView extends Component {
  constructor(private events: IEvents) {
    super('card-basket');
  }

  render(item: BasketItem, index: number): HTMLElement {
    this.setTextContent('.basket__item-index', String(index + 1));
    this.setTextContent('.basket__item-title', item.title);
    this.setTextContent('.basket__item-price', formatPrice(item.price));
    
    this.addEventListener('.basket__item-delete', 'click', () => {
      this.events.emit('basket:remove', { id: item.id });
    });
    
    return this.root;
  }
}
