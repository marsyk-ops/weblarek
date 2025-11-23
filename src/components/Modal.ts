export class Modal {
  private _element: HTMLElement;

  constructor(container: HTMLElement) {
    this._element = container;
    this._element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target === this._element || target.closest('.modal__close')) {
        this.close();
      }
    });

    // Запрет прокрутки при открытом модале
    this._element.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  setContent(content: HTMLElement): void {
    const contentSlot = this._element.querySelector('.modal__content');
    if (contentSlot) {
      contentSlot.replaceWith(content);
      content.classList.add('modal__content');
    }
  }

  open(): void {
    this._element.classList.add('modal_active');
    document.body.classList.add('modal-open');
  }

  close(): void {
    this._element.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
  }
}