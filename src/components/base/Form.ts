import { Component } from './Component';
import type { IEvents } from './events';

export abstract class Form<T = any> extends Component {
  protected submitBtn: HTMLButtonElement;
  protected errorsEl: HTMLElement;
  protected isFormValid: boolean = false;

  constructor(templateId: string, protected events: IEvents) {
    super(templateId);
    this.submitBtn = this.root.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = this.root.querySelector('.form__errors') as HTMLElement;

    this.setupFormEventListeners();
    this.setupValidationListeners();
  }

  private setupFormEventListeners(): void {
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', (e) => {
        e?.preventDefault();
        this.handleSubmit();
      });
    }

    this.setupInputChangeListeners();
  }

  private setupValidationListeners(): void {
    this.events.on('form:validation:result', (data: { isValid: boolean; errors: string[] }) => {
      this.updateFormState(data);
    });
  }

  private setupInputChangeListeners(): void {
    const inputs = this.root.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.onInputChange(input);
      });
      
      input.addEventListener('select', (e) => {
        e.stopPropagation();
      });
      
      input.addEventListener('focus', (e) => {
        e.stopPropagation();
      });
    });
  }

  private onInputChange(input: HTMLInputElement): void {
    const name = input.name;
    const value = input.value;
    
    this.emitFieldChange(name, value);
  }

  protected abstract emitFieldChange(fieldName: string, value: string): void;

  protected handleSubmit(): void {
    if (this.isFormValid) {
      this.onSubmit();
    } else {
      this.requestValidation();
    }
  }

  protected abstract requestValidation(): void;

  private updateFormState(validation: { isValid: boolean; errors: string[] }): void {
    this.isFormValid = validation.isValid;

    if (this.submitBtn) {
      this.submitBtn.disabled = !validation.isValid;
    }

    this.setTextContent('.form__errors', validation.errors.join(', '));
  }

  protected abstract onSubmit(): void;
}
