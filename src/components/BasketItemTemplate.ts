
import { IShopItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component"
import { IEvents } from "./base/events";

interface IBasketItemTemplate {
    index: number;
    title: string;
    price: number;
}

export class BasketItemTemplate extends Component<IBasketItemTemplate> {

      protected _basketItemTitle: HTMLElement;
     protected _basketItemPrice: HTMLElement;
     protected _basketDeleteButton: HTMLButtonElement;
     protected _id: string;
     protected _index: HTMLElement;

      constructor(container:HTMLElement, protected events: IEvents,  _id: string) { 
        super(container);
        this._basketItemTitle = ensureElement('.card__title', this.container);
        this._basketItemPrice = ensureElement('.card__price', this.container);
        this._basketDeleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
        this._index = ensureElement('.basket__item-index', this.container)
         this._id = _id;

           this._basketDeleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', {id: this._id})
        })

    }
    set id (value:string) {
        this._id = value
    }

    set index(value: number) {
        this.setText(this._index, value)
    }

     set title(value: string) {
        this.setText(this._basketItemTitle, value);
    }
    set price(value:number| null) {
             this.setText(this._basketItemPrice, value);      
       
    }
}