import type { IEvents } from '../components/base/events';
import type { IOrderPart2 } from '../types';

export class ContactValidationModel {
  private email: string = '';
  private phone: string = '';

  constructor(private events: IEvents) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.events.on('form:validate:contacts', () => {
      this.validateAndEmit();
    });
  }

  setEmail(email: string): void {
    this.email = email;
    this.validateAndEmit();
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.validateAndEmit();
  }

  private validateAndEmit(): void {
    const validation = this.validateContacts();
    
    this.events.emit('form:validation:result', {
      isValid: validation.isValid,
      errors: validation.errors,
      data: validation.data
    });
  }

  private validateContacts(): { 
    isValid: boolean; 
    errors: string[]; 
    data: Partial<IOrderPart2> 
  } {
    const emailValid = this.isValidEmail(this.email);
    const phoneValid = this.isValidPhone(this.phone);
    const isValid = emailValid && phoneValid;

    const errors: string[] = [];
    if (!emailValid && this.email.length > 0) {
      errors.push('Введите корректный email');
    }
    if (!phoneValid && this.phone.length > 0) {
      errors.push('Введите корректный номер телефона');
    }

    if (this.email.length === 0) {
      errors.push('Введите email');
    }
    if (this.phone.length === 0) {
      errors.push('Введите номер телефона');
    }

    return {
      isValid,
      errors,
      data: {
        email: this.email,
        phone: this.phone
      }
    };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPhone(phone: string): boolean {
    return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
  }

  getFormData(): IOrderPart2 {
    return {
      email: this.email,
      phone: this.phone
    };
  }
}
