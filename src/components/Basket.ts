export class Basket {
	constructor(private template: HTMLTemplateElement) {}

	render(items: HTMLElement[], total: number, p0: () => void): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const list = clone.querySelector('.basket__list');
		const price = clone.querySelector('.basket__price');
		const button = clone.querySelector('.basket__button') as HTMLButtonElement;

		if (list) list.replaceChildren(...items);
		if (price) price.textContent = `${total} синапсов`;
		if (button) button.disabled = items.length === 0;

		return clone as HTMLElement;
	}
}