import type { IEvents } from '../components/base/events';
import type { EventPayloadMap } from '../types';

export class ModalService {
  private root: HTMLElement;
  private content: HTMLElement;
  private closeBtn: HTMLButtonElement;

  private onBackdrop = (e: MouseEvent) => {
    if (e.target === this.root) this.close();
  };

  constructor(private events: IEvents) {
    this.root = document.querySelector('.modal')!;
    this.content = this.root.querySelector('.modal__content')!;
    this.closeBtn = this.root.querySelector('.modal__close')!;

    this.root.addEventListener('click', this.onBackdrop);
    this.closeBtn.addEventListener('click', () => this.close());

    events.on('modal:open', (payload) => {
      const { content } = payload as EventPayloadMap['modal:open'];
      this.open(content);
    });

    events.on('modal:close', () => this.close());
  }

  private lockBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll() {
    document.body.style.overflow = '';
  }

  open(content: HTMLElement) {
    this.content.replaceChildren(content);
    
    if (content.classList.contains('basket')) {
      this.root.classList.add('modal_basket');
    } else {
      this.root.classList.remove('modal_basket');
    }
    
    this.root.classList.add('modal_active');
    this.lockBodyScroll();
  }

  close() {
    this.root.classList.remove('modal_active', 'modal_basket');
    this.content.replaceChildren();
    this.unlockBodyScroll();
  }
}
