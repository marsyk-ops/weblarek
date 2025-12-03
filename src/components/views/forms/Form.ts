import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      '.modal__actions button[type="submit"]',
      container
    );
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);
  }

  setErrors(errors: Partial<Record<string, string>>): void {
    const messages = Object.values(errors).filter(Boolean);
    this.errorsElement.textContent = messages.join(' ');
  }

  set submitButtonDisabled(state: boolean) {
    this.submitButton.disabled = state;
  }

}
