export class Modal {
	private isOpen: boolean = false;

	constructor(private container: HTMLElement) {
		container.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target === container || target.closest('.modal__close')) {
				this.close();
			}
		});
	}

	setContent(element: HTMLElement) {
		const content = this.container.querySelector('.modal__content');
		if (content) {
			content.replaceChildren(element);
		}
	}

	open() {
		this.container.classList.add('modal_active');
		document.body.classList.add('modal-open');
		this.isOpen = true;
	}

	close() {
		this.container.classList.remove('modal_active');
		document.body.classList.remove('modal-open');
		this.isOpen = false;
	}

	isOpenModal(): boolean {
		return this.isOpen;
	}
}