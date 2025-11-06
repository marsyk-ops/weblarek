import type { IOrderPart1, PaymentMethod } from '../types';
import type { IEvents } from '../components/base/events';
import { Form } from '../components/base/Form';
import { OrderStep1ValidationModel } from '../models/OrderStep1ValidationModel';

export class CheckoutStep1View extends Form<IOrderPart1> {
  private addressInput: HTMLInputElement;
  private paymentCardBtn: HTMLButtonElement;
  private paymentCashBtn: HTMLButtonElement;
  private validationModel: OrderStep1ValidationModel;

  constructor(events: IEvents) {
    super('order', events);
    this.addressInput = this.root.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentCardBtn = this.root.querySelector('button[name="card"]') as HTMLButtonElement;
    this.paymentCashBtn = this.root.querySelector('button[name="cash"]') as HTMLButtonElement;

    this.validationModel = new OrderStep1ValidationModel(this.events);
    
    this.setupPaymentListeners();
  }

  mount(part: IOrderPart1): HTMLElement {
    this.setInputValue('input[name="address"]', part.address ?? '');
    
    this.initializeValidationModel(part);
    
    this.setActivePayment(part.payment ?? null);
    
    return this.root;
  }

  private initializeValidationModel(part: IOrderPart1): void {
    this.validationModel.setAddress(part.address ?? '');
    this.validationModel.setPayment(part.payment ?? null);
    
    this.requestValidation();
  }

  private setupPaymentListeners(): void {
    this.paymentCardBtn.addEventListener('click', () => this.togglePayment('card'));
    this.paymentCashBtn.addEventListener('click', () => this.togglePayment('cash'));
  }

  private togglePayment(method: Exclude<PaymentMethod, null>): void {
    const current = this.getActivePayment();
    const next = current === method ? null : method;
    this.setActivePayment(next);
    
    this.validationModel.setPayment(next);
  }

  private setActivePayment(method: PaymentMethod): void {
    this.paymentCardBtn.classList.remove('button_alt-active');
    this.paymentCashBtn.classList.remove('button_alt-active');
    
    if (method === 'card') {
      this.paymentCardBtn.classList.add('button_alt-active');
    } else if (method === 'cash') {
      this.paymentCashBtn.classList.add('button_alt-active');
    }
  }

  private getActivePayment(): PaymentMethod {
    if (this.paymentCardBtn.classList.contains('button_alt-active')) return 'card';
    if (this.paymentCashBtn.classList.contains('button_alt-active')) return 'cash';
    return null;
  }

  protected emitFieldChange(fieldName: string, value: string): void {
    if (fieldName === 'address') {
      this.validationModel.setAddress(value);
    }
  }

  protected requestValidation(): void {
    this.events.emit('form:validate:step1');
  }
  
  protected onSubmit(): void {
    const formData = this.validationModel.getFormData();
    this.events.emit('order:fill-step1', formData);
  }
}