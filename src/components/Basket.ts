export class Basket {
  private element: HTMLElement;

  constructor(
    private items: HTMLElement[],
    private total: number,
    private onOrderClick: () => void
  ) {
    this.element = this.render();
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="basket">
        <div class="basket__items">
          ${this.items.length > 0 ? this.items.map(item => item.outerHTML).join('') : '<p class="basket__empty">Корзина пуста</p>'}
        </div>
        <div class="basket__total">
          <p>Сумма: <span class="basket__total-value">${this.total} синапсов</span></p>
          <button class="basket__button button button_size_l" ${this.items.length === 0 ? 'disabled' : ''}>
            Оформить
          </button>
        </div>
      </div>
    `.trim();

    const orderBtn = wrapper.querySelector('.basket__button');
    orderBtn?.addEventListener('click', this.onOrderClick);

    return wrapper.firstElementChild as HTMLElement;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}