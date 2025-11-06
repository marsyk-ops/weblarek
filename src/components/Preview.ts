import { IShopItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component"
import { IEvents } from "./base/events";


export class Preview extends Component<IShopItem> {

     protected _previewTitle: HTMLElement;
    protected _previewAddButton: HTMLButtonElement;
    protected _previewImage: HTMLImageElement;
    protected _previewPrice: HTMLElement;
    protected _previewCategory: HTMLElement;
    protected _previewDescription: HTMLElement;
    protected _id: string;

      constructor(container:HTMLElement, protected events: IEvents) { 
        super(container);


   
         this._previewTitle = ensureElement('.card__title', this.container);
        this._previewAddButton = ensureElement('.card__button', this.container) as HTMLButtonElement;
        this._previewImage = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._previewPrice = ensureElement('.card__price', this.container);
        this._previewCategory = ensureElement('.card__category', this.container);
        this._previewDescription = ensureElement('.card__text', this.container);
        
        
    }

    set id (value:string) {
        this._id = value
    }

     set title(value: string) {
        this.setText(this._previewTitle, value);
    }

    set description(value:string) {
        this.setText(this._previewDescription, value);
    }

    set category(value:string) {
          this.setText(this._previewCategory, value);
           this.toggleClass(this._previewCategory, 'card__category_soft', false)
            this.toggleClass(this._previewCategory, 'card__category_additional', false)
             this.toggleClass(this._previewCategory, 'card__category_button', false)
              this.toggleClass(this._previewCategory, 'card__category_hard', false)
               this.toggleClass(this._previewCategory, 'card__category_other', false)
        switch(value) {
            case 'софт-скил': 
            this.toggleClass(this._previewCategory, 'card__category_soft', true)
            break;
            case 'дополнительное':
                 this.toggleClass(this._previewCategory, 'card__category_additional', true)
                break;
            case 'кнопка':
                 this.toggleClass(this._previewCategory, 'card__category_button', true)
                    break;
            case 'хард-скил':
                this.toggleClass(this._previewCategory, 'card__category_hard', true)
                    break;
            default:
                 this.toggleClass(this._previewCategory, 'card__category_other', true)
                 break
        }
    }

     set price(value:number| null) {
        if(value === null){
            this.setText(this._previewPrice, 'Бесценно');
            this.setDisabled(this._previewAddButton, true);
            this.setText(this._previewAddButton, 'Недоступно')
        } else {
             this.setText(this._previewPrice, value);
              this.setDisabled(this._previewAddButton, false);
      
        }
    }

    buttonState(value: boolean): void {
        if (value === true) {
               this.setText(this._previewAddButton, 'В корзину')
               this._previewAddButton.addEventListener('click', () => {
            this.events.emit('basket:add', {id: this._id})
            return this.container
        })
        } else {
               this.setText(this._previewAddButton, 'Удалить из корзины')
               this._previewAddButton.addEventListener('click', () => {
            this.events.emit('basket:remove', {id: this._id})
             return this.container
        })
        }
    }

      set image(value: string) {
        this.setImage(this._previewImage, value)
    }

}