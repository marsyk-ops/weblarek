import { TPayment } from '../../types';
import { BaseForm } from './BaseForm';

const ORDER_FIRST_TEMPLATE = `
  <form class="order">
    <div class="order__buttons">
      <button type="button" class="button button_alt" data-payment="card">Онлайн</button>
      <button type="button" class="button button_alt" data-payment="cash">При получении</button>
    </div>
    <div class="form__field">
      <input type="text" name="address" placeholder="Адрес доставки" class="input">
      <span class="form__error form__error_address"></span>
    </div>
    <button type="submit" class="button button_size_l order__button">Далее</button>
  </form>
`;

export class OrderFormFirstStep extends BaseForm {
  constructor(
    payment: TPayment,
    address: string,
    private callbacks: {
      onChange: (field: string, value: string) => void;
      onNext: () => void;
    }
  ) {
    super(ORDER_FIRST_TEMPLATE);
    if (address) {
      (this.element.querySelector('[name="address"]') as HTMLInputElement).value = address;
    }
    if (payment) {
      this.element
        .querySelector(`[data-payment="${payment}"]`)
        ?.classList.add('button_alt-active');
    }
  }

  protected setEventListeners(form: HTMLElement): void {
    const paymentButtons = form.querySelectorAll('.button[data-payment]');
    paymentButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        const payment = (btn as HTMLElement).dataset.payment as TPayment;
        this.callbacks.onChange('payment', payment);
      });
    });

    const addressInput = form.querySelector('[name="address"]') as HTMLInputElement;
    addressInput?.addEventListener('input', (e) => {
      this.callbacks.onChange('address', (e.target as HTMLInputElement).value);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.callbacks.onNext();
    });
  }
}