import { IOrderResult, IShopItem } from "../types";
import { Api, ApiListResponse } from "./base/api";
import { IOrderForm } from '../types/index';
import { IBasketModel } from "./basket";
import { OrderModel } from "./OrderModel";


export interface IShopAPI {
    getItems: () => Promise<IShopItem[]>;
    getItem: (id: string) => Promise<IShopItem>;
    placeOrder(basket: Array<string>, order: OrderModel, total: number): Promise<IOrderResult>
    
}

export class ShopAPI extends Api implements IShopAPI {

        readonly cdn: string;
     
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItem(id:string): Promise<IShopItem> {
        return this.get(`/product/${id}`).then(
            (item: IShopItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getItems():  Promise<IShopItem[]> {
        return this.get(`/product`).then((data: ApiListResponse<IShopItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    placeOrder(basket: Array<string>, order: OrderModel, total: number): Promise<IOrderResult> {
       
        return this.post('/order', {
            payment: order.order.payment,
            email: order.order.email,
            phone: order.order.phone,
            address: order.order.address,
            total: total,
            items: basket
        }).then(
            (data: IOrderResult) => data
        )
    }
}

