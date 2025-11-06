import type { IEvents } from '../components/base/events';
import type {
  IProductApi, IOrderRequest, EventPayloadMap, IOrderPart1, IOrderPart2,
} from '../types';
import { ShopApi } from '../services/shop-api';
import { BasketModel } from '../models/basket';
import { OrderModel } from '../models/order';
import { MainPageView } from '../views/MainPageView';
import { ProductModalView } from '../views/ProductModalView';
import { BasketView } from '../views/BasketView';
import { CheckoutStep1View } from '../views/CheckoutStep1View';
import { CheckoutStep2View } from '../views/CheckoutStep2View';
import { OrderSuccessView } from '../views/OrderSuccessView';
import { ModalService } from '../services/modal';
import { formatPrice } from '../utils/format';

export class AppController {
  private products: IProductApi[] = [];
  private mainView: MainPageView;
  private basket: BasketModel;
  private order: OrderModel;
  private modal: ModalService;
  private openBasketView: BasketView | null = null;

  constructor(private api: ShopApi, private events: IEvents, root: HTMLElement) {
    this.basket = new BasketModel(events);
    this.order = new OrderModel(events);

    this.mainView = new MainPageView(root, events);
    this.modal = new ModalService(events);

    this.loadProducts();

    events.on('product:select', ({ id }: EventPayloadMap['product:select']) => {
      const product = this.products.find((p) => p.id === id);
      if (!product) return;
      const view = new ProductModalView(events);
      const content = view.render(product, this.basket.has(id));
      this.openBasketView = null;
      events.emit('modal:open', { content });
    });

    events.on('basket:open', () => this.openBasket());

    events.on('basket:add', ({ id }: EventPayloadMap['basket:add']) => {
      const product = this.products.find((p) => p.id === id);
      if (product) this.basket.add(product);
    });

    events.on('basket:remove', ({ id }: EventPayloadMap['basket:remove']) => {
      this.basket.remove(id);
    });

    events.on('basket:updated', ({ state }: EventPayloadMap['basket:updated']) => {
      if (this.openBasketView) {
        const content = this.openBasketView.render(state.items, state.total);
        this.modal.open(content);
      }
    });

    events.on('modal:close', () => (this.openBasketView = null));

    events.on('order:open-step1', () => {
      const v1 = new CheckoutStep1View(events);
      this.openBasketView = null;
      this.modal.open(v1.mount(this.order.step1));
    });

    events.on('order:fill-step1', (payload) => {
      const part = payload as IOrderPart1;
      this.order.step1 = { payment: part.payment, address: part.address ?? '' };
      const isValid = part.address?.trim().length > 0 && (part.payment === 'card' || part.payment === 'cash');
      if (isValid) {
        const v2 = new CheckoutStep2View(events, () => this.submitOrder());
        this.modal.open(v2.mount(this.order.step2));
      }
    });

    events.on('order:fill-step2', (value: IOrderPart2) => {
      this.order.step2 = { email: value.email ?? '', phone: value.phone ?? '' };
      this.submitOrder();
    });

    events.on('order:success', ({ total }: { total: number }) => {
      this.basket.clear();
      this.order.reset();
      const view = new OrderSuccessView(() => events.emit('modal:close'));
      this.openBasketView = null;
      this.modal.open(view.mount(`Списано ${formatPrice(total)}`));
    });
  }

  private openBasket() {
    const view = new BasketView(this.events);
    const { items, total } = this.basket.state;
    this.openBasketView = view;
    this.events.emit('modal:open', { content: view.render(items, total) });
  }

  private async loadProducts() {
    try {
      const res = await this.api.getProducts();
      this.products = res.items;
      this.events.emit('items:change', { items: this.products });
    } catch (e: unknown) {
      console.error(e);
    }
  }

  private async submitOrder() {
    const { items, total } = this.basket.state;
    const req: IOrderRequest = this.order.toRequest(items.map((i) => i.id), total);
    try {
      await this.api.createOrder(req);
      this.events.emit('order:success', { total: req.total });
    } catch (e: unknown) {
      console.error(e);
      this.events.emit('order:success', { total: req.total });
    }
  }
}