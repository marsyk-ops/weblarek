export abstract class BaseForm {
  protected element: HTMLElement;
  protected errors: { [field: string]: string } = {};

  constructor(protected template: string) {
    this.element = this.render();
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template.trim();
    const form = wrapper.firstElementChild as HTMLElement;
    this.setEventListeners(form);
    return form;
  }

  protected abstract setEventListeners(form: HTMLElement): void;

  protected renderError(field: string, message: string): void {
    const errorContainer = this.element.querySelector(`.form__error_${field}`);
    if (errorContainer) {
      errorContainer.textContent = message;
    }
  }

  protected clearError(field: string): void {
    this.renderError(field, '');
  }

  public setErrors(errors: { [field: string]: string }): void {
    Object.keys(errors).forEach(field => {
      this.renderError(field, errors[field]);
    });
    // Очистим поля без ошибок
    Object.keys(this.errors).forEach(field => {
      if (!errors[field]) this.clearError(field);
    });
    this.errors = errors;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}