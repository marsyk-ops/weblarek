import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component"
import { IEvents } from "./base/events";
import { IBasketModel } from "./basket";

interface IBasketView {
    total: number;
    list: HTMLElement[]
    buttonDisabled: boolean;

}



export class BasketView extends Component<IBasketView> {
   
    protected _basketViewList: HTMLElement
    protected _basketSubmitButton: HTMLButtonElement;
    protected _basketViewTotal: HTMLElement;

     constructor(container:HTMLElement, protected events: IEvents) { 
        super(container);

        this._basketSubmitButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
        this._basketViewList = ensureElement('.basket__list', this.container);
        this._basketViewTotal = ensureElement('.basket__price', this.container);

        this._basketSubmitButton.addEventListener('click', () => {
            events.emit('basket:submit')
        })

     }

     set total (value: number) {
        this.setText(this._basketViewTotal, `${value} синапсов`)
     }

      set list(items: HTMLElement[]) {
        if (items.length) {
              this._basketViewList.replaceChildren(...items);
        } else {
               this._basketViewList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
                
               }));
        }
        
       
    }

    set buttonDisabled (value: boolean) {
     this.setDisabled(this._basketSubmitButton, value)
    }
}