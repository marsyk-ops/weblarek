import { IProduct } from '../types';

export class CardBasket {
	constructor(private template: HTMLTemplateElement, private index: number) {}

	render(product: IProduct, p0: () => void): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;

		const title = clone.querySelector('.card__title');
		if (title) title.textContent = product.title;

		const price = clone.querySelector('.card__price');
		if (price) {
			price.textContent = product.price !== null
				? `${product.price} синапсов`
				: 'Бесценно';
		}

		const indexEl = clone.querySelector('.basket__item-index');
		if (indexEl) indexEl.textContent = String(this.index);

		(clone as HTMLElement).dataset.id = product.id;
		return clone as HTMLElement;
	}
}