import './scss/styles.scss';
import { Api } from './utils/api';
import { LarekAPI } from './components/api/AppApi';
import { Products } from './models/Products';
import { Basket } from './models/basket';
import { Buyer } from './models/order';
import { apiProducts } from './utils/data';

// === Тест моделей ===
console.log('🧪 Тест моделей...');

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log('📦 Каталог:', productsModel.getItems());

const basket = new Basket();
const firstProduct = productsModel.getItems()[0];
if (firstProduct) {
  basket.add(firstProduct);
  console.log('🛒 Корзина:', basket.getItems());
  console.log('💰 Итого:', basket.getTotal());
}

const buyer = new Buyer();
buyer.set('address', 'Москва, Тверская 1');
buyer.set('payment', 'card');
console.log('📝 Валидация:', buyer.validate());

// === Подключение к серверу ===
console.log('\n🌐 Подключение к API...');

const api = new Api('https://larek-api.nomoreparties.co');
const larekApi = new LarekAPI(api);
const productsFromServer = new Products();

larekApi.loadProducts()
  .then(items => {
    productsFromServer.setItems(items);
    console.log('✅ Товары с сервера:', productsFromServer.getItems());
  })
  .catch(err => {
    console.error('❌ Ошибка загрузки товаров:', err);
  });