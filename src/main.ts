import { API_URL } from './utils/constants';
import { Api } from './components/base/Api'; 
import { AppState } from './components/models/AppState'; 
import { EventEmitter } from './utils/EventEmitter';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { Customer } from './components/models/Customer';
import './scss/styles.scss';
import { apiProducts } from './utils/data';

// Компоненты View
import { Page } from './components/Page';
import { Gallery } from './components/Gallery';
import { Modal } from './components/Modal';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { Basket } from './components/Basket';
import { OrderForm } from './components/forms/OrderForm';
import { ContactsForm } from './components/forms/ContactsForm';
import { SuccessMessage } from './components/forms/SuccessMessage';

// Типы
import { IProduct } from './types';

// === Инициализация ===
const api = new Api(API_URL);
const appState = new AppState();
const events = appState as unknown as EventEmitter;

// === Создание компонентов (один раз в начале) ===
const page = new Page(document.querySelector('.page')!);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('#modal-container')!);

const cardCatalog = new CardCatalog(document.querySelector<HTMLTemplateElement>('#card-catalog')!);
const cardPreview = new CardPreview(document.querySelector<HTMLTemplateElement>('#card-preview')!);
const cardBasketTemplate = document.querySelector<HTMLTemplateElement>('#card-basket')!;
const basketView = new Basket(document.querySelector<HTMLTemplateElement>('#basket')!);
const orderForm = new OrderForm(document.querySelector<HTMLTemplateElement>('#order')!);
const contactsForm = new ContactsForm(document.querySelector<HTMLTemplateElement>('#contacts')!);
const successMessage = new SuccessMessage(document.querySelector<HTMLTemplateElement>('#success')!);

// === Вспомогательные функции ===
const updateBasketCounter = () => {
  page.counter = appState.cart.getCartCount();
};

// === Обработка событий ===

events.on('items:changed', (items: IProduct[]) => {
  const cards = items.map(item =>
    cardCatalog.render(item, () => events.emit('card:select', item))
  );
  gallery.setItems(cards);
});

events.on('card:select', (product: IProduct) => {
  const isInBasket = appState.hasInCart(product.id);
  const element = cardPreview.render(product, isInBasket, () => {
    if (isInBasket) {
      events.emit('card:delete', product.id);
    } else {
      events.emit('card:buy', product);
    }
  });
  modal.setContent(element);
  modal.open();
});

events.on('card:buy', (product: IProduct) => {
  appState.addToCart(product);
  modal.close();
});

events.on('card:delete', (id: string) => {
  const item = appState.catalog.getItemById(id);
  appState.removeFromCart(item);
  modal.close();
});

events.on('cart:changed', updateBasketCounter);

events.on('basket:open', () => {
  const items = appState.cart.getCartList();
  const renderedItems = items.map((item, index) => {
    const c = new CardBasket(cardBasketTemplate!, index + 1);
    return c.render(item, () => appState.removeFromCart(item));
  });
  const total = appState.cart.getCartSum();
  const basketElement = basketView.render(renderedItems, total, () => {
    events.emit('order:submit');
  });
  modal.setContent(basketElement);
  modal.open();
});

events.on('order:submit', () => {
  const { payment, address } = appState.customer.getUser();
  const formElement = orderForm.render(payment, address);

  // Обработка выбора оплаты
  formElement.querySelectorAll('.button[name]').forEach(btn => {
    btn.addEventListener('click', () => {
      const method = (btn as HTMLElement).getAttribute('name') as 'card' | 'cash';
      appState.updateCustomer({ payment: method });
      formElement.querySelectorAll('.button_alt').forEach(b => b.classList.remove('button_alt-active'));
      btn.classList.add('button_alt-active');
    });
  });

  // Обработка адреса
  const addressInput = formElement.querySelector('[name="address"]') as HTMLInputElement;
  addressInput?.addEventListener('input', (e) => {
    appState.updateCustomer({ address: (e.target as HTMLInputElement).value });
  });

  // Кнопка "Далее"
  const submitBtn = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
  submitBtn.disabled = !appState.isOrderFirstStepValid();
  appState.on('order:changed', () => {
    submitBtn.disabled = !appState.isOrderFirstStepValid();
  });
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (appState.isOrderFirstStepValid()) {
      events.emit('order:next');
    }
  });

  modal.setContent(formElement);
});

events.on('order:next', () => {
  const { email, phone } = appState.customer.getUser();
  const formElement = contactsForm.render(email, phone);

  formElement.querySelectorAll('.form__input').forEach(input => {
    input.addEventListener('input', (e) => {
      const name = (e.target as HTMLInputElement).name;
      const value = (e.target as HTMLInputElement).value;
      appState.updateCustomer({ [name]: value });
    });
  });

  const submitBtn = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
  submitBtn.disabled = !appState.isOrderSecondStepValid();
  appState.on('order:changed', () => {
    submitBtn.disabled = !appState.isOrderSecondStepValid();
  });
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (appState.isOrderSecondStepValid()) {
      events.emit('order:pay');
    }
  });

  modal.setContent(formElement);
});

events.on('order:pay', async () => {
  try {
    const { buyer, items, total } = appState.getOrderData();
    const orderData = { ...buyer, items, total };
    await api.post('/orders', orderData);
    appState.clearOrder();
    const successElement = successMessage.render(total);
    successElement.querySelector('.order-success__close')?.addEventListener('click', () => {
      modal.close();
    });
    modal.setContent(successElement);
  } catch (err) {
    // В реальном проекте — показ ошибки в UI
    console.error('Ошибка оплаты:', err);
    modal.close();
  }
});

// === Загрузка данных ===
api.get('/product')
  .then(data => appState.setCatalogItems(data.items))
  .catch(() => {
    // Fallback: тестовые данные без console.log
    const mockProducts: IProduct[] = [
      {
        id: '1',
        title: 'Тестовый товар 1',
        description: 'Описание товара 1',
        image: '/src/images/Subtract.svg',
        category: 'софт-скил',
        price: 750,
      },
      {
        id: '2',
        title: 'Тестовый товар 2',
        description: 'Описание товара 2',
        image: '/src/images/Subtract.svg',
        category: 'хард-скил',
        price: 1000,
      },
    ];
    appState.setCatalogItems(mockProducts);
  });

// Инициализация UI
updateBasketCounter();


