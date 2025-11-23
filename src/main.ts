import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './utils/EventEmitter';
import { Api } from './components/base/Api';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Customer } from './components/models/Customer';
import { Modal } from './components/Modal';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { CardBasket } from './components/CardBasket';
import { Basket } from './components/Basket';
import { OrderFormFirstStep } from './components/forms/OrderFormFirstStep';
import { OrderFormSecondStep } from './components/forms/OrderFormSecondStep';
import { OrderSuccess } from './components/forms/OrderSuccess';

// Инициализация
const events = new EventEmitter();
const api = new Api(API_URL);
const catalog = new Catalog();
const cart = new Cart();
const customer = new Customer();

const pageContainer = document.querySelector('.page') as HTMLElement;
const gallery = document.querySelector('.gallery');
const basketButton = document.querySelector('.header__basket');
const modal = new Modal(document.querySelector('.modal') as HTMLElement);

// Обновление счётчика корзины
const updateBasketCounter = () => {
  const count = cart.getCartCount();
  if (basketButton) {
    const counter = basketButton.querySelector('.header__basket-counter');
    if (counter) counter.textContent = String(count);
    (basketButton as HTMLElement).classList.toggle('header__basket_empty', count === 0);
  }
};

// Рендер каталога
events.on('items:changed', (items: IProduct[]) => {
  if (!gallery) return;
  const cards = items.map(item => {
    return new CardCatalog(item, () => {
      catalog.setCurrentItem(item);
    }).getElement();
  });
  gallery.replaceChildren(...cards);
});

// Открытие превью товара
events.on('preview:changed', (product: IProduct) => {
  const isInBasket = cart.hasItem(product.id);
  const card = new CardPreview(product, isInBasket, {
    onBuy: () => {
      cart.addToCart(product);
      modal.close();
    },
    onDelete: () => {
      cart.removeFromCart(product);
      modal.close();
    }
  });
  modal.setContent(card.getElement());
  modal.open();
});

// Обновление корзины (в том числе счётчика)
events.on('cart:changed', () => {
  updateBasketCounter();
});

// Открытие корзины по клику на иконку
basketButton?.addEventListener('click', () => {
  const items = cart.getCartList().map(item => {
    return new CardBasket(item, () => cart.removeFromCart(item)).getElement();
  });
  const total = cart.getCartSum();
  const basket = new Basket(items, total, () => {
    events.emit('order:start');
  });
  modal.setContent(basket.getElement());
  modal.open();
});

// Начало оформления заказа
events.on('order:start', () => {
  const { payment, address } = customer.getUser();
  const form = new OrderFormFirstStep(payment, address, {
    onChange: (field, value) => {
      customer.setUser({ [field]: value });
    },
    onNext: () => {
      if (customer.isValidFirstStep()) {
        events.emit('order:next');
      } else {
        const formInstance = modal.element.querySelector('.order')?.['__formInstance'] as OrderFormFirstStep;
        formInstance?.setErrors(customer.validateUser());
      }
    }
  });
  // Сохраняем инстанс для валидации
  (form.getElement() as any)['__formInstance'] = form;
  modal.setContent(form.getElement());
});

// Переход ко второму шагу
events.on('order:next', () => {
  const { email, phone } = customer.getUser();
  const form = new OrderFormSecondStep(email, phone, {
    onChange: (field, value) => {
      customer.setUser({ [field]: value });
    },
    onPay: () => {
      if (customer.isValidSecondStep()) {
        events.emit('order:pay');
      } else {
        const errors = customer.validateUser();
        // Уберём ошибки первого шага
        delete errors.payment;
        delete errors.address;
        const formInstance = modal.element.querySelector('.order')?.['__formInstance'] as OrderFormSecondStep;
        formInstance?.setErrors(errors);
      }
    }
  });
  (form.getElement() as any)['__formInstance'] = form;
  modal.setContent(form.getElement());
});

// Отправка заказа
events.on('order:pay', async () => {
  try {
    const orderData = {
      ...customer.getUser(),
      total: cart.getCartSum(),
      items: cart.getCartList().map(item => item.id)
    };
    const result = await api.post('/orders', orderData);
    cart.emptyCart();
    customer.clear();
    const success = new OrderSuccess(orderData.total);
    modal.setContent(success.getElement());
  } catch (err) {
    console.error('Ошибка оформления заказа:', err);
    // Можно показать ошибку в модалке
  }
});

// Загрузка каталога
api.get('/product')
  .then(catalog.setItems)
  .catch(console.error);

// Инициализация счётчика корзины
updateBasketCounter();