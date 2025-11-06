import type { IProductApi } from '../../types';
import type { IEvents } from './events';
import { Component } from './Component';
import { formatPrice } from '../../utils/format';

export abstract class ProductCard extends Component {
  protected currentProduct: IProductApi | null = null;

  constructor(templateId: string, protected events: IEvents) {
    super(templateId);
  }

  protected setProductInfo(product: IProductApi): void {
    this.currentProduct = product;
    this.setTextContent('.card__title', product.title);
    this.setTextContent('.card__price', formatPrice(product.price));
    this.setTextContent('.card__category', product.category);
    
    this.setCategoryClass(product.category);
    
    this.setImage('.card__image', product.image, product.title);
  }

  protected setCategoryClass(category: string): void {
    const categoryClass = this.getCategoryClass(category);
    const categoryEl = this.root.querySelector('.card__category');
    if (categoryEl) {
      categoryEl.className = `card__category card__category_${categoryClass}`;
    }
  }

  protected setImage(selector: string, src: string, alt: string): void {
    const imageEl = this.root.querySelector(selector) as HTMLImageElement;
    if (imageEl) {
      imageEl.src = src;
      imageEl.alt = alt;
    }
  }

  protected getCategoryClass(category: string): string {
    const categoryMap: Record<string, string> = {
      'софт-скил': 'soft',
      'другое': 'other',
      'дополнительное': 'additional',
      'кнопка': 'button',
      'хард-скил': 'hard'
    };
    return categoryMap[category] || 'other';
  }

  protected getCurrentProduct(): IProductApi | null {
    return this.currentProduct;
  }
}
