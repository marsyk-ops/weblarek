export class OrderSuccess {
  private element: HTMLElement;

  constructor(private total: number) {
    this.element = this.render();
  }

  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'order-success';
    div.innerHTML = `
      <p>Спасибо за заказ!</p>
      <p>На вашу почту отправлена квитанция на <strong>${this.total} синапсов</strong>.</p>
    `;
    return div;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}