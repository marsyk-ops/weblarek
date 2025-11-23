import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';

export abstract class BaseCard {
  protected element: HTMLElement;
  protected _product: IProduct;

  constructor(protected template: string, product: IProduct) {
    this._product = product;
    this.element = this.render();
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template.trim();
    const card = wrapper.firstElementChild as HTMLElement;

    const category = card.querySelector('.card__category');
    if (category && this._product.category) {
      category.textContent = this._product.category;
      category.className = 'card__category'; // сброс
      category.classList.add(categoryMap[this._product.category] || '');
    }

    const title = card.querySelector('.card__title');
    if (title) title.textContent = this._product.title;

    const image = card.querySelector('.card__image') as HTMLImageElement;
    if (image) image.src = this._product.image;

    const price = card.querySelector('.card__price');
    if (price) {
      if (this._product.price === null) {
        price.textContent = 'Бесценно';
      } else {
        price.textContent = `${this._product.price} синапсов`;
      }
    }

    this.setupListeners(card);
    return card;
  }

  protected abstract setupListeners(element: HTMLElement): void;

  getElement(): HTMLElement {
    return this.element;
  }
}