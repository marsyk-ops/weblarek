import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';

export class CardCatalog {
  constructor(private template: HTMLTemplateElement) {}

  render(product: IProduct, onClick: () => void): HTMLElement {
    // Проверяем, что шаблон содержит корневой элемент
    const root = this.template.content.querySelector('*');
    if (!root) {
      throw new Error('Шаблон #card-catalog не содержит разметки');
    }

    // Клонируем именно корневой элемент (а не firstElementChild, если структура изменится)
    const clone = root.cloneNode(true) as HTMLElement;

    // === Заполнение данных ===

    // Категория
    const category = clone.querySelector<HTMLElement>('.card__category');
    if (category && product.category) {
      category.textContent = product.category;
      // Сбрасываем классы и добавляем нужный
      category.className = 'card__category';
      const categoryClass = categoryMap[product.category as keyof typeof categoryMap];
      if (categoryClass) {
        category.classList.add(categoryClass);
      }
    }

    // Название
    const title = clone.querySelector<HTMLElement>('.card__title');
    if (title) {
      title.textContent = product.title;
    }

    // Изображение
    const image = clone.querySelector<HTMLImageElement>('.card__image');
    if (image) {
      image.src = product.image;
    }

    // Цена
    const price = clone.querySelector<HTMLElement>('.card__price');
    if (price) {
      price.textContent = product.price === null
        ? 'Бесценно'
        : `${product.price} синапсов`;
    }

    // Устанавливаем ID товара на корневой элемент
    clone.dataset.id = product.id;

    // === Обработка клика ===
    clone.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // предотвращает всплытие (на всякий случай)
      onClick();
    });

    return clone;
  }
}