export class SuccessMessage {
	constructor(private template: HTMLTemplateElement) {}

	render(total: number): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const description = clone.querySelector('.order-success__description');
		if (description) {
			description.textContent = `Списано ${total} синапсов`;
		}
		return clone as HTMLElement;
	}
}