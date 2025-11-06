import { Component } from '../components/base/Component';

export class OrderSuccessView extends Component {
  private descEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(private onClose: () => void) {
    super('success');
    this.descEl = this.root.querySelector('.order-success__description')!;
    this.closeBtn = this.root.querySelector('.order-success__close') as HTMLButtonElement;
    
    this.addEventListener('.order-success__close', 'click', () => this.onClose());
  }

  mount(message: string): HTMLElement {
    this.setTextContent('.order-success__description', message);
    return this.root;
  }
}
