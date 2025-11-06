import type { BasketItem } from '../types';
import type { IEvents } from '../components/base/events';
import { Component } from '../components/base/Component';
import { formatPrice } from '../utils/format';
import { BasketItemView } from './BasketItemView';

export class BasketView extends Component {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private emptyEl: HTMLElement;

  constructor(private events: IEvents) {
    super('basket');
    this.listEl = this.root.querySelector('.basket__list')!;
    this.totalEl = this.root.querySelector('.basket__price')!;
    this.buttonEl = this.root.querySelector('.basket__button') as HTMLButtonElement;
    this.emptyEl = this.root.querySelector('.basket__empty-text') as HTMLElement;

    this.addEventListener('.basket__button', 'click', () => 
      this.events.emit('order:open-step1')
    );
  }

  render(items: BasketItem[], total: number): HTMLElement {
    const isEmpty = items.length === 0;
    
    const itemViews = items.map((item, idx) => 
      new BasketItemView(this.events).render(item, idx)
    );
    
    this.listEl.replaceChildren(...itemViews);
    this.setTextContent('.basket__price', formatPrice(total));
    this.setDisplay('.basket__empty-text', isEmpty ? 'block' : 'none');
    this.setDisplay('.basket__list', isEmpty ? 'none' : 'flex');
    this.setButtonDisabled('.basket__button', isEmpty);

    return this.root;
  }
}