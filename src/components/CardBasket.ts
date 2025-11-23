import { IProduct } from '../types';
import { BaseCard } from './BaseCard';

const CARD_BASKET_TEMPLATE = `
  <div class="cart__item card" data-id="{{id}}">
    <div class="card__category"></div>
    <img class="card__image" src="" alt="{{title}}">
    <h3 class="card__title"></h3>
    <span class="card__price">{{price}} синапсов</span>
    <button class="cart__button button button_type_icon button_icon_bin"></button>
  </div>
`;

export class CardBasket extends BaseCard {
  constructor(product: IProduct, private onDelete: () => void) {
    const price = product.price !== null ? product.price : 0;
    const template = CARD_BASKET_TEMPLATE
      .replace('{{id}}', product.id)
      .replace('{{title}}', product.title)
      .replace('{{price}}', String(price));

    super(template, product);
  }

  protected setupListeners(element: HTMLElement): void {
    const deleteBtn = element.querySelector('.cart__button');
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onDelete();
    });
  }
}