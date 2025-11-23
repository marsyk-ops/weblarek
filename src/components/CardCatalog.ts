import { IProduct } from '../types';
import { BaseCard } from './BaseCard';

const CARD_CATALOG_TEMPLATE = `
  <div class="card catalog__item" data-id="{{id}}">
    <div class="card__category"></div>
    <img class="card__image" src="" alt="{{title}}">
    <h3 class="card__title"></h3>
    <span class="card__price"></span>
  </div>
`;

export class CardCatalog extends BaseCard {
  constructor(product: IProduct, private onClick: () => void) {
    // Подставим id в шаблон (опционально, но удобно)
    const template = CARD_CATALOG_TEMPLATE.replace('{{id}}', product.id).replace('{{title}}', product.title);
    super(template, product);
  }

  protected setupListeners(element: HTMLElement): void {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      this.onClick();
    });
  }
}