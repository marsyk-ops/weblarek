import { EventEmitter } from './components/base/events';
import { ShopAPI } from './components/ShopAPI';
import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { CatalogModel } from './components/Catalog';
import { Card } from './components/card';
import { Preview } from './components/Preview';
import { BasketModel } from './components/basket';
import { BasketView } from './components/BasketView';
import { IShopItem } from './types/index';
import { BasketItemTemplate } from './components/BasketItemTemplate';
import { OrderView } from './components/OrderView';
import { OrderModel } from './components/OrderModel';
import { IOrderForm } from './types/index';
import { ContactView } from './components/ContactView';
import { Success } from './components/Success';


const api = new ShopAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const catalog = new CatalogModel();
const basket = new BasketModel(events)
const order = new OrderModel({}, events)

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success')
const gallery = document.querySelector('.gallery') as HTMLElement



const page = new Page(document.body, events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardPreview = new Preview(cloneTemplate(cardPreviewTemplate), events)
const basketView = new BasketView(cloneTemplate(basketTemplate), events)
const orderView = new OrderView(cloneTemplate(orderFormTemplate), events)
const contactView = new ContactView(cloneTemplate(contactsTemplate), events)
const successView = new Success(cloneTemplate(successTemplate), events)



events.on('card:open', ({ id }: { id: string }) => {
    const card = catalog.getItem(id)

    if (basket.items.has(id)) {

        cardPreview.buttonState(false)
    } else {
        cardPreview.buttonState(true)
    }
    modal.render(
        {
            content: cardPreview.render({
                id: card.id,
                title: card.title,
                category: card.category,
                price: card.price,
                description: card.description,
                image: card.image
            })
        }
    )

})

events.on('basket:open', () => {

 


        modal.render({
            content: basketView.render()
        })
    }
)

events.on('basket:add', ({ id }: { id: string }) => {
    const item = catalog.getItem(id)
    basket.add(item.id, item.price)


})


events.on('basket:remove', ({ id }: { id: string }) => {
    basket.remove(id)

})

events.on('basket:change', ({ state }: { state: boolean }) => {
    page.render({
        counter: basket.items.size
    })
    if (state === true) {
        cardPreview.buttonState(false)
        


    } else if (state === false) {
        cardPreview.buttonState(true)
       
    }
     const items: IShopItem[] = []

     const basketItems = basket.getItems()

        basketItems.forEach((value, key) => {
            const item = catalog.getItem(key)
            items.push(item)
        })
        if (items.length === 0) {


            basketView.render({
                buttonDisabled: true,
                list: [],
                total: 0,
            })


        } else {
            const list = items.map(item => new BasketItemTemplate(cloneTemplate(cardBasketTemplate), events, item.id).render({
                title: item.title,
                price: item.price,
                index: items.indexOf(item) + 1
            }))


            basketView.render({
                list: list,
                total: basket.calculateTotal(),
                buttonDisabled: false,
            })

        }




})

events.on('modal:open', () => {
    page.locked = true;
});


events.on('modal:close', () => {
    page.locked = false;
});




events.on('items:changed', () => {
    const catalogItemsHTMLArr = catalog.getItems().map(item => new Card(cloneTemplate(cardCatalogTemplate), events, item.id).render(item))

    page.render(
        {
            catalog: catalogItemsHTMLArr,
        }
    )
})





events.on('basket:submit', () => {
    modal.close()
    events.emit('order:open')
})

events.on('order:open', () => {

    orderView.setActiveButton(order.order.payment)
    if (order.order.payment && order.order.address) {

        modal.render(
            {
                content: orderView.render({
                    address: order.order.address,
                    errors: [],
                    valid: true,
                })
            }
        )


    } else {
        modal.render(
            {
                content: orderView.render({
                    address: order.order.address,
                    errors: [],
                    valid: false,
                })
            }
        )
    }

})


events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    order.setOrderField(data.field, data.value);
    if (order.order.payment && order.order.address) {
        orderView.render(
            {
                valid: true,
                errors: [],
            }
        )
    }

});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    order.setOrderField(data.field, data.value);
    if (order.order.phone && order.order.email) {
        contactView.render(
            {
                valid: true,
                errors: [],
            }
        )
    }

});

events.on('order.payment:change', () => {
    orderView.setActiveButton(order.order.payment)

})

events.on('order:submit', () => {
    events.emit('contacts:open')

})

events.on('contacts:open', () => {


    if (order.order.email && order.order.phone) {

        modal.render(
            {
                content: contactView.render({
                    phone: order.order.phone,
                    email: order.order.email,
                    errors: [],
                    valid: true,
                })
            }
        )


    } else {
        modal.render(
            {
                content: contactView.render({
                    phone: order.order.phone,
                    email: order.order.email,
                    errors: [],
                    valid: false,
                })
            }
        )
    }

})

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { address, payment, email, phone } = errors;
    orderView.valid = !address && !payment;
    orderView.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');
    contactView.valid = !phone && !email;
    contactView.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});


events.on('contacts:submit', () => {

    events.emit('order:send');
})

events.on('order:send', () => {
    const total = basket.calculateTotal()
    const items = Array.from(basket.items.keys())
    api.placeOrder(items, order, total)
        .then(
            data => {
                const total = data.total
                events.emit('order:success', { total })
                basket.clearBasket()
                order.clearOrder()
                page.render({
                    counter: basket.items.size
                })
            }
        )
        .catch(err => console.log(err))
})

events.on('order:success', ({ total }: { total: number }) => {
    modal.render({
        content: successView.render({
            total: total
        })
    })
})

events.on('success:close', () => {
    modal.close()
})

api.getItems()
    .then(
        data => {
            catalog.setItems(data)
            events.emit('items:changed')
        }
    )
    .catch(err => console.log(err))