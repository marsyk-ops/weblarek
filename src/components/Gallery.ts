export class Gallery {
	constructor(private container: HTMLElement) {}

	setItems(cards: HTMLElement[]) {
		this.container.replaceChildren(...cards);
	}
}