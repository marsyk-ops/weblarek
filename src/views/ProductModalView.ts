import type { IProductApi } from '../types';
import type { IEvents } from '../components/base/events';
import { ProductCard } from '../components/base/ProductCard';

export class ProductModalView extends ProductCard {
  private buyBtn: HTMLButtonElement;

  constructor(events: IEvents) {
    super('card-preview', events);
    this.buyBtn = this.root.querySelector('.card__button') as HTMLButtonElement;
  }

  render(product: IProductApi, inCart: boolean): HTMLElement {
    this.ensureMediaWrapper();

    this.setProductInfo(product);
    
    this.setTextContent('.card__text', product.description || '');

    this.updateButton(product.price === null, inCart);

    return this.root;
  }

  private ensureMediaWrapper(): void {
    const media = this.root.querySelector('.card__media') as HTMLElement | null;
    if (!media) {
      const img = this.root.querySelector('.card__image') as HTMLImageElement | null;
      if (img) {
        const wrap = document.createElement('div');
        wrap.className = 'card__media';
        img.replaceWith(wrap);
        wrap.appendChild(img);
      }
    }
  }

  private updateButton(isPriceless: boolean, inCart: boolean): void {
    if (isPriceless) {
      this.setTextContent('.card__button', 'Недоступно');
      this.setButtonDisabled('.card__button', true);
      this.buyBtn.onclick = null;
    } else {
      this.setButtonDisabled('.card__button', false);
      this.setupButtonHandlers(inCart);
    }
  }

  private setupButtonHandlers(inCart: boolean): void {
    if (inCart) {
      this.setTextContent('.card__button', 'Удалить из корзины');
      this.buyBtn.onclick = () => {
        const product = this.getCurrentProduct();
        if (!product) return;
        this.events.emit('basket:remove', { id: product.id });
        this.setupButtonHandlers(false);
      };
    } else {
      this.setTextContent('.card__button', 'Купить');
      this.buyBtn.onclick = () => {
        const product = this.getCurrentProduct();
        if (!product) return;
        this.events.emit('basket:add', { id: product.id });
        this.setupButtonHandlers(true);
      };
    }
  }
}
