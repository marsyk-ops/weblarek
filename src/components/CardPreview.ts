import { IProduct } from '../types';
import { BaseCard } from './BaseCard';

const CARD_PREVIEW_TEMPLATE = `
  <div class="card" data-id="{{id}}">
    <button class="card__button button button_type_icon button_icon_close modal__close"></button>
    <div class="card__category"></div>
    <img class="card__image" src="" alt="{{title}}">
    <div class="card__text">
      <h3 class="card__title"></h3>
      <p class="card__description">{{description}}</p>
    </div>
    <div class="card__price-container">
      <span class="card__price"></span>
      <button class="card__button button button_size_m">{{buttonText}}</button>
    </div>
  </div>
`;

export class CardPreview extends BaseCard {
  constructor(
    product: IProduct,
    isInBasket: boolean,
    private callbacks: {
      onBuy: () => void;
      onDelete: () => void;
    }
  ) {
    let buttonText = 'Недоступно';
    if (product.price !== null) {
      buttonText = isInBasket ? 'Удалить из корзины' : 'Купить';
    }

    const template = CARD_PREVIEW_TEMPLATE
      .replace('{{id}}', product.id)
      .replace('{{title}}', product.title)
      .replace('{{description}}', product.description || '')
      .replace('{{buttonText}}', buttonText);

    super(template, product);
  }

  protected setupListeners(element: HTMLElement): void {
    const button = element.querySelector('.card__button:not(.modal__close)') as HTMLButtonElement;
    const price = this._product.price;

    if (price === null) {
      button.disabled = true;
    } else {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (button.textContent?.includes('Удалить')) {
          this.callbacks.onDelete();
        } else {
          this.callbacks.onBuy();
        }
      });
    }
  }
}