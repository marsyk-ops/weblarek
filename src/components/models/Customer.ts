import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from "../../utils/EventEmitter";

export class Customer extends EventEmitter implements IBuyer {
  payment: TPayment = '';
  email: string = '';
  phone: string = '';
  address: string = '';

  setUser(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.emit('order:changed', this.getUser());
  }

  getUser(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('order:cleared');
  }

  validateUser(): { [key: string]: string } {
    const error: { [key: string]: string } = {};
    if (!this.payment) error.payment = 'Необходимо выбрать способ оплаты';
    if (!this.email) error.email = 'Необходимо указать email';
    if (!this.phone) error.phone = 'Необходимо указать телефон';
    if (!this.address) error.address = 'Необходимо указать адрес';
    return error;
  }

  isValid(): boolean {
    return Object.keys(this.validateUser()).length === 0;
  }

  isValidFirstStep(): boolean {
    return !!this.payment && !!this.address;
  }

  isValidSecondStep(): boolean {
    return !!this.email && !!this.phone;
  }
}