import { IShopItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component"
import { IEvents } from "./base/events";



export class Card extends Component<IShopItem> {

    protected _cardTitle: HTMLElement;
    protected _cardButton: HTMLButtonElement;
    protected _cardImage: HTMLImageElement;
    protected _cardPrice: HTMLElement;
    protected _cardCategory: HTMLElement;
    protected _id: string;
    
    constructor(container:HTMLElement, protected events: IEvents, _id: string) { 
        super(container);

        this._id = _id;
        this._cardTitle = ensureElement('.card__title', this.container);
        this._cardButton = ensureElement(this.container) as HTMLButtonElement;
        this._cardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._cardPrice = ensureElement('.card__price', this.container);
        this._cardCategory = ensureElement('.card__category', this.container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit('card:open', {id: this._id})
        })
    }

    set title(value: string) {
        this.setText(this._cardTitle, value);
    }

    set category(value:string) {
          this.setText(this._cardCategory, value);
        switch(value) {
            case 'софт-скил': 
            this.toggleClass(this._cardCategory, 'card__category_soft', true)
            break;
            case 'дополнительное':
                 this.toggleClass(this._cardCategory, 'card__category_additional', true)
                break;
            case 'кнопка':
                 this.toggleClass(this._cardCategory, 'card__category_button', true)
                    break;
            case 'хард-скил':
                this.toggleClass(this._cardCategory, 'card__category_hard', true)
                    break;
            default:
                 this.toggleClass(this._cardCategory, 'card__category_other', true)
                 break
        }
    }

    set price(value:number| null) {
        if(value === null){
            this.setText(this._cardPrice, 'Бесценно');
        } else {
             this.setText(this._cardPrice, value);
        }
    }

    set image(value: string) {
        this.setImage(this._cardImage, value)
    }

 
}

