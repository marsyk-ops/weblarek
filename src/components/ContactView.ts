import { IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class ContactView extends Form<IOrderForm> {
    
    set email(value: string) {
          (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
          (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}