import { IOrderForm, FormErrors } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class OrderModel extends Model<IOrderForm> {
    order: IOrderForm = {
        payment: '',
    address: '',
    email: '',
    phone: ''
    };
    formErrors: FormErrors = {};
    events: IEvents;

        setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            
            this.events.emit('order:ready', this.order);
        }
    }

     validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        } 
        if(!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearOrder() :void {
        this.order = {
              payment: '',
        address: '',
        email: '',
         phone: ''
        }
        console.log(this.order)
    }

}

