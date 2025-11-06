import type { IOrderPart2 } from '../types';
import type { IEvents } from '../components/base/events';
import { Form } from '../components/base/Form';
import { ContactValidationModel } from '../models/ContactValidationModel';

export class CheckoutStep2View extends Form<IOrderPart2> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private validationModel: ContactValidationModel;

  constructor(events: IEvents, private onOrderSubmit: () => void) {
    super('contacts', events);
    this.emailInput = this.root.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = this.root.querySelector('input[name="phone"]') as HTMLInputElement;

    this.validationModel = new ContactValidationModel(this.events);
  }

  mount(part: IOrderPart2): HTMLElement {
    this.setInputValue('input[name="email"]', part.email ?? '');
    this.setInputValue('input[name="phone"]', part.phone ?? '');
    
    this.initializeValidationModel(part);
    
    return this.root;
  }

  private initializeValidationModel(part: IOrderPart2): void {
    this.validationModel.setEmail(part.email ?? '');
    this.validationModel.setPhone(part.phone ?? '');
    
    this.requestValidation();
  }

  protected emitFieldChange(fieldName: string, value: string): void {
    if (fieldName === 'email') {
      this.validationModel.setEmail(value);
    } else if (fieldName === 'phone') {
      this.validationModel.setPhone(value);
    }
  }

  protected requestValidation(): void {
    this.events.emit('form:validate:contacts');
  }

  protected onSubmit(): void {
    const formData = this.validationModel.getFormData();
    this.events.emit('order:fill-step2', formData);
    this.onOrderSubmit();
  }
}