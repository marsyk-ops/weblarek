export class ContactsForm {
	constructor(private template: HTMLTemplateElement) {}

	render(email: string, phone: string): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const emailInput = clone.querySelector('[name="email"]') as HTMLInputElement;
		const phoneInput = clone.querySelector('[name="phone"]') as HTMLInputElement;

		if (emailInput) emailInput.value = email;
		if (phoneInput) phoneInput.value = phone;

		return clone as HTMLElement;
	}
}