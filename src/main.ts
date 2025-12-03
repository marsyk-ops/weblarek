import "./scss/styles.scss";
import { ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/views/header/Header";
import { Modal } from "./components/views/modal/Modal";
import { Basket } from "./components/views/basket/Basket";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate } from "./utils/utils";
import { Gallery } from "./components/views/gallery/Gallery";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { DataExchanger } from "./components/base/Communication";
import { OrderForm } from "./components/views/forms/OrderForm";
import { ContactsForm } from "./components/views/forms/ContactsForm";
import { Success } from "./components/views/success/Success";
import { Api } from "./components/base/Api";
import { EVENTS } from "./types";
import { CardCatalog } from "./components/views/card/CardCatalog";
import { CardPreview } from "./components/views/card/CardPreview";
import { CardBasket } from "./components/views/card/CardBasket";
import { IProduct, TPayment } from "./types";

const headerElement = ensureElement<HTMLElement>(".header");
const modalElement = ensureElement<HTMLElement>("#modal-container");
const basketElement = ensureElement<HTMLTemplateElement>("#basket");
const galleryElement = ensureElement<HTMLElement>("main");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderFormElement = ensureElement<HTMLTemplateElement>("#order");
const contactsFormElement = ensureElement<HTMLTemplateElement>("#contacts");
const successElement = ensureElement<HTMLTemplateElement>("#success");

const events = new EventEmitter();
const api = new Api(API_URL);
const dataExchanger = new DataExchanger(api);

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const header = new Header(headerElement, events);
const modal = new Modal(modalElement, events);
const basket = new Basket(cloneTemplate(basketElement), events);
const gallery = new Gallery(galleryElement);
const orderForm = new OrderForm(cloneTemplate(orderFormElement), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormElement), events);
const success = new Success(cloneTemplate(successElement), events);

function loadCatalog() {
  dataExchanger
    .getProducts()
    .then((catalogData) => {
      catalogData.items.forEach((item) => {
        item.image = CDN_URL + item.image;
      });
      catalog.setProducts(catalogData.items);
    })
    .catch((error) => console.error("Ошибка при получении данных:", error));
}

function openPreview() {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onChange: () => {
      events.emit(EVENTS.card.action, product);
    },
  });

  const isInCart = cart.hasItem(product.id);
  if (product.price === null) {
    card.buttonCaption = 'Недоступно';
    card.setButtonDisabled(true);
  } else if (isInCart) {
    card.buttonCaption = 'Удалить из корзины';
    card.setButtonDisabled(false);
  } else {
    card.buttonCaption = 'Купить';
    card.setButtonDisabled(false);
  }

  modal.content = card.render(product);
  modal.setVisible(true);
}

function openBasket() {
  const items = cart.getItems();
  const total = cart.getTotalPrice();
  const count = items.length

  const basketCards = items.map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onRemove: () => events.emit(EVENTS.card.remove, product),
    });
    card.setIndex(index + 1);
    return card.render(product);
  });

  basket.items = basketCards;
  basket.total = total;
  basket.checkoutButtonDisabled = count === 0;

  if (count === 0) {
    basket.setEmptytBasketTitle();
  } else {
    basket.setFulltBasketTitle();
  }
  modal.content = basket.render();
  modal.setVisible(true);
  header.counter = cart.getCount();
}

function updateBasket() {
  header.counter = cart.getCount();
  const total = cart.getTotalPrice();
  const count = cart.getCount();

  const basketCards = cart.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onRemove: () => events.emit(EVENTS.card.remove, product),
    });
    card.setIndex(index + 1);
    return card.render(product);
  });

  basket.items = basketCards;
  basket.total = total;
  basket.checkoutButtonDisabled = count === 0;


  header.counter = count;
}


function openOrderForm() {
  const { payment, address } = buyer.getData();
  updateOrderFormValidity();
  modal.content = orderForm.render({ payment, address });
}

function openContactsForm() {
  const { email, phone } = buyer.getData();
  updateContactsFormValidity();
  modal.content = contactsForm.render({ email, phone });
}

function openSuccess({ total }: { total: number }) {
  success.total = total;
  modal.content = success.render();
  modal.setVisible(true);
}

function updateOrderFormValidity() {
  const errors = buyer.validate();
  const hasErrors = "address" in errors || "payment" in errors;
  orderForm.setErrors(errors);
  orderForm.submitButtonDisabled = hasErrors;
}

function updateContactsFormValidity() {
  const errors = buyer.validate();
  const hasErrors = "email" in errors || "phone" in errors;
  contactsForm.setErrors(errors);
  contactsForm.submitButtonDisabled = hasErrors;
}


events.on(EVENTS.catalog.changed, () => {
  const cards = catalog.getProducts().map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        console.log('Клик по товару:', product.title);
        catalog.setSelectedProduct(product);
        events.emit(EVENTS.catalog.select, product);
      },
    });
    return card.render(product);
  });
  gallery.items = cards;
});


events.on(EVENTS.basket.open, () => openBasket());
events.on(EVENTS.basket.checkout, () => openOrderForm());
events.on(EVENTS.order.submit, () => openContactsForm());
events.on<IProduct>(EVENTS.catalog.select, (product) => {
  console.log('Выбран товар:', product.title);
  openPreview();
});

events.on<IProduct>(EVENTS.card.action, (product) => {

  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }
  modal.setVisible(false);
});

events.on<IProduct>(EVENTS.card.remove, (product) => {
  console.log('Удаление товара:', product.id, product.title);
  cart.removeItem(product.id);
  console.log('Корзина после удаления:', cart.getItems());
});

events.on(EVENTS.cart.changed, updateBasket);

events.on<{ address: string }>(EVENTS.order.address, (data) => buyer.setAddress(data.address));
events.on<{ payment: TPayment }>(EVENTS.order.payment, (data) => buyer.setPayment(data.payment));
events.on<{ email: string }>(EVENTS.contacts.email, (data) => buyer.setEmail(data.email));
events.on<{ phone: string }>(EVENTS.contacts.phone, (data) => buyer.setPhone(data.phone));

events.on(EVENTS.buyer.addressChanged, updateOrderFormValidity);
events.on(EVENTS.buyer.emailChanged, updateContactsFormValidity);
events.on(EVENTS.buyer.phoneChanged, updateContactsFormValidity);
events.on<{ payment: TPayment }>(EVENTS.buyer.paymentChanged, updateOrderFormValidity);

events.on(EVENTS.contacts.submit, async () => {
  try {
    const result = await dataExchanger.sendOrder({
      ...buyer.getData(),
      items: cart.getItems().map((item) => item.id),
      total: cart.getTotalPrice(),
    });
    openSuccess(result);
    cart.clear();
    buyer.clear();
  } catch (error) {
    console.error("Ошибка отправки заказа:", error);
  }
});

events.on(EVENTS.success.close, () => modal.setVisible(false));
events.on(EVENTS.modal.close, () => modal.setVisible(false));

loadCatalog();
header.counter = cart.getCount();

