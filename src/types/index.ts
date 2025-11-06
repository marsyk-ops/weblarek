
export interface IShopItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;

}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// export type TBasketModal = Pick<IShopItem, 'title' | 'price'>
export type TOrderModal = Pick<IOrderForm, 'payment' | 'address'>