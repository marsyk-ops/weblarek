import { BaseForm } from './BaseForm';

const ORDER_SECOND_TEMPLATE = `
  <form class="order">
    <div class="form__field">
      <input type="email" name="email" placeholder="Email" class="input">
      <span class="form__error form__error_email"></span>
    </div>
    <div class="form__field">
      <input type="text" name="phone" placeholder="Телефон" class="input">
      <span class="form__error form__error_phone"></span>
    </div>
    <button type="submit" class="button button_size_l order__button">Оплатить</button>
  </form>
`;

export class OrderFormSecondStep extends BaseForm {
  constructor(
    email: string,
    phone: string,
    private callbacks: {
      onChange: (field: string, value: string) => void;
      onPay: () => void;
    }
  ) {
    super(ORDER_SECOND_TEMPLATE);
    if (email) (this.element.querySelector('[name="email"]') as HTMLInputElement).value = email;
    if (phone) (this.element.querySelector('[name="phone"]') as HTMLInputElement).value = phone;
  }

  protected setEventListeners(form: HTMLElement): void {
    const emailInput = form.querySelector('[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;

    emailInput?.addEventListener('input', (e) => {
      this.callbacks.onChange('email', (e.target as HTMLInputElement).value);
    });

    phoneInput?.addEventListener('input', (e) => {
      this.callbacks.onChange('phone', (e.target as HTMLInputElement).value);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.callbacks.onPay();
    });
  }
}