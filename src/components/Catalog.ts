import { IShopItem } from "../types";

export interface ICatalog {
    items: IShopItem[];
    setItems(items: IShopItem[]):void;
    getItem(id: string): IShopItem;
    getItems(): IShopItem[];
}


export class CatalogModel implements ICatalog {
     items: IShopItem[] = []


        setItems(items: IShopItem[]):void {
            this.items = items;
        };

        
    getItem(id: string): IShopItem {
        return this.items.find(item => item.id === id)
    };

    getItems(): IShopItem[] {
        return this.items;
    }
}

