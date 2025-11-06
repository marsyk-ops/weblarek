import type { IEvents } from '../components/base/events';
import type { IProductApi, EventPayloadMap } from '../types';
import { CardView } from './CardView';

export class MainPageView {
  private root: HTMLElement;
  private events: IEvents;
  private listEl: HTMLElement;
  private basketBtn: HTMLButtonElement;
  private counterEl: HTMLElement;

  constructor(root: HTMLElement, events: IEvents) {
    this.root = root;
    this.events = events;
    this.listEl = root;
    this.basketBtn = document.querySelector('.header__basket') as HTMLButtonElement;
    this.counterEl = document.querySelector('.header__basket-counter') as HTMLElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.basketBtn.addEventListener('click', () => this.events.emit('basket:open'));

    this.listEl.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.card');
      if (card) {
        const productId = card.getAttribute('data-product-id');
        if (productId) {
          this.events.emit('product:select', { id: productId });
        }
      }
    });

    this.events.on('items:change', (payload) => {
      const { items } = payload as EventPayloadMap['items:change'];
      this.render(items);
    });

    this.events.on('basket:updated', (payload) => {
      const { state } = payload as EventPayloadMap['basket:updated'];
      this.counterEl.textContent = String(state.items.length);
    });
  }

  private render(items: IProductApi[]): void {
    const fragments = items.map((product) => {
      const cardView = new CardView(this.events);
      const element = cardView.render(product);
      element.setAttribute('data-product-id', product.id);
      return element;
    });
    this.listEl.replaceChildren(...fragments);
  }
}
