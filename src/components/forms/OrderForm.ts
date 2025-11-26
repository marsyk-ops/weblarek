export class OrderForm {
	constructor(private template: HTMLTemplateElement) {}

	render(payment: string, address: string): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;

		const cardBtn = clone.querySelector('[name="card"]');
		const cashBtn = clone.querySelector('[name="cash"]');
		const addressInput = clone.querySelector('[name="address"]') as HTMLInputElement;

		if (addressInput) addressInput.value = address;

		if (payment === 'card') {
			cardBtn?.classList.add('button_alt-active');
		} else if (payment === 'cash') {
			cashBtn?.classList.add('button_alt-active');
		}

		return clone as HTMLElement;
	}
}