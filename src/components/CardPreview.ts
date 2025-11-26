import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';

export class CardPreview {
  constructor(private template: HTMLTemplateElement) {}

  render(
    product: IProduct,
    isInBasket: boolean,
    onClick: () => void
  ): HTMLElement {
    const clone = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;

    if (!clone) {
      throw new Error('Шаблон карточки просмотра пуст');
    }

    // Категория
    const category = clone.querySelector('.card__category');
    if (category && product.category) {
      category.textContent = product.category;
      category.className = 'card__category';
      const categoryClass = categoryMap[product.category as keyof typeof categoryMap] || '';
      category.classList.add(categoryClass);
    }

    // Заголовок
    const title = clone.querySelector('.card__title');
    if (title) title.textContent = product.title;

    // Описание
    const text = clone.querySelector('.card__text');
    if (text) text.textContent = product.description || '';

    // Изображение
    const image = clone.querySelector('.card__image') as HTMLImageElement | null;
    if (image) image.src = product.image;

    // Цена и кнопка
    const price = clone.querySelector('.card__price');
    const button = clone.querySelector('.card__button') as HTMLButtonElement | null;

    if (product.price === null) {
      if (button) {
        button.textContent = 'Недоступно';
        button.disabled = true;
      }
      if (price) price.textContent = 'Бесценно';
    } else {
      if (price) price.textContent = `${product.price} синапсов`;
      if (button) {
        button.textContent = isInBasket ? 'Удалить из корзины' : 'В корзину';
        button.disabled = false;
        // ⚠️ Обработчик — внутри компонента!
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          onClick(); // вызов коллбэка от презентера
        });
      }
    }

    return clone;
  }
}