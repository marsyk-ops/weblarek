import type { IEvents } from '../components/base/events';
import type { IOrderPart1, PaymentMethod } from '../types';

export class OrderStep1ValidationModel {
  private address: string = '';
  private payment: PaymentMethod = null;

  constructor(private events: IEvents) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.events.on('form:validate:step1', () => {
      this.validateAndEmit();
    });
  }

  setAddress(address: string): void {
    this.address = address;
    this.validateAndEmit();
  }

  setPayment(payment: PaymentMethod): void {
    this.payment = payment;
    this.validateAndEmit();
  }

  private validateAndEmit(): void {
    const validation = this.validateStep1();
    
    this.events.emit('form:validation:result', {
      isValid: validation.isValid,
      errors: validation.errors,
      data: validation.data
    });
  }

  private validateStep1(): { 
    isValid: boolean; 
    errors: string[]; 
    data: Partial<IOrderPart1> 
  } {
    const addressValid = this.address.length >= 5;
    const paymentValid = this.payment !== null;
    const isValid = addressValid && paymentValid;

    const errors: string[] = [];
    if (!paymentValid) {
      errors.push('Необходимо выбрать способ оплаты');
    } else if (!addressValid) {
      errors.push('Необходимо указать адрес');
    }

    return {
      isValid,
      errors,
      data: {
        address: this.address,
        payment: this.payment
      }
    };
  }

  getFormData(): IOrderPart1 {
    return {
      address: this.address,
      payment: this.payment
    };
  }
}
