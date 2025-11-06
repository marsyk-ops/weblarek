import type { IEvents } from '../components/base/events';
import type {
  IOrderPart1,
  IOrderPart2,
  IOrderRequest,
  ID,
  IValidationResult,
  FormErrors,
  PaymentMethod
} from '../types';

export class OrderModel {
  step1: IOrderPart1 = { payment: null, address: '' };
  step2: IOrderPart2 = { email: '', phone: '' };

  constructor(private events: IEvents) {}

  setStep1(part: Partial<IOrderPart1>) {
    this.step1 = { ...this.step1, ...part };
    const res = this.validateStep1();
    this.publishValidation(1, res);
    return res;
  }

  setStep2(part: Partial<IOrderPart2>) {
    this.step2 = { ...this.step2, ...part };
    const res = this.validateStep2();
    this.publishValidation(2, res);
    return res;
  }

  toRequest(items: ID[], total: number): IOrderRequest {
    return {
      ...this.step1,
      ...this.step2,
      items,
      total,
    } as IOrderRequest;
  }

  reset() {
    this.step1 = { payment: null, address: '' };
    this.step2 = { email: '', phone: '' };
  }

  private publishValidation(step: 1 | 2, res: IValidationResult<IOrderPart1 & IOrderPart2>) {
    this.events.emit('form:errors', { errors: res.errors });
    this.events.emit('form:valid', { step, isValid: res.valid });
  }

  private validateStep1(): IValidationResult<IOrderPart1 & IOrderPart2> {
    const errors: FormErrors<IOrderPart1 & IOrderPart2> = {};
    if (!this.step1.address?.trim()) errors.address = 'Укажите адрес';
    if (!this.step1.payment) errors.payment = 'Выберите способ оплаты';
    return { valid: Object.keys(errors).length === 0, errors };
  }

  private validateStep2(): IValidationResult<IOrderPart1 & IOrderPart2> {
    const errors: FormErrors<IOrderPart1 & IOrderPart2> = {};
    if (!this.step2.email?.trim()) errors.email = 'Укажите email';
    if (!this.step2.phone?.trim()) errors.phone = 'Укажите телефон';
    return { valid: Object.keys(errors).length === 0, errors };
  }
}