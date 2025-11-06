import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component"
import { IEvents } from "./base/events";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess>
{
    protected _total: HTMLElement;
    protected _successButton: HTMLButtonElement;

    constructor(container:HTMLElement, protected events: IEvents) { 
        super(container);

        this._total = ensureElement('.order-success__description', this.container)
        this._successButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        
        this._successButton.addEventListener('click', () => {
            this.events.emit('success:close')
        })
    }

    set total(value: string) {
          this.setText(this._total, value);
    }

}