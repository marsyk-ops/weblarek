import { EventEmitter, IEvents } from './base/events';
import { IShopItem } from '../types';

 
 export interface IBasketModel {
    items: Map<string, number>;
    add (id: string, price: number): void;
    remove (id: string): void;
    
}



export class BasketModel implements IBasketModel {

    items: Map<string, number> = new Map()
     
    constructor(protected events: IEvents) {

    }

   
    add(id: string, price:number): void {
        if(!this.items.has(id)) this.items.set(id,price)
            this.events.emit('basket:change', {state: true})
            // this.items.set(id, this.items.get(id)! + 1)
    }

    remove(id: string): void {
        if (!this.items.has(id)) return;
            else {this.items.delete(id)}
                this.events.emit('basket:change', {state: false})
    }

    calculateTotal(): number {
        let total = 0
        this.items.forEach((value) => {
            total = total + value
        })
        return total
    }

    clearBasket(): void {
        this.items.clear()
    }

     getItems(): Map<string, number> {
        return this.items;
    }

    
}