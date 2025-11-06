import { IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./Form";


export class OrderView extends Form<IOrderForm>  {
    protected _cashButton: HTMLButtonElement
    protected _cardButton: HTMLButtonElement
    

        constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);



      this._cashButton = ensureElement( '[name = cash]', this.container) as HTMLButtonElement
              this._cardButton = ensureElement( '[name = card]', this.container) as HTMLButtonElement
    }

    set address(value:string) {
         (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
       
    }

     setActiveButton(value:string) : void {
       

        if (value === 'card') {
             this.toggleClass(this._cardButton, 'button_alt-active', true )
              this.toggleClass(this._cashButton, 'button_alt-active', false )
        } else if (value === 'cash') {
             this.toggleClass(this._cardButton, 'button_alt-active', false )
              this.toggleClass(this._cashButton, 'button_alt-active', true )
        }
            else {
                 this.toggleClass(this._cardButton, 'button_alt-active', false )
              this.toggleClass(this._cashButton, 'button_alt-active', false )
            }
    }
}