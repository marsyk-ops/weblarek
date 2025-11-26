export class Page {
	constructor(private container: HTMLElement) {}

	set counter(value: number) {
		const counter = this.container.querySelector('.header__basket-counter');
		if (counter) counter.textContent = String(value);
	}

	set locked(state: boolean) {
		if (state) {
			this.container.classList.add('page_locked');
		} else {
			this.container.classList.remove('page_locked');
		}
	}
}