import { IProduct, ICardActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { Card } from "./Card";

export type TCardCatalog = Pick<
  IProduct,
  "image" | "category" | "price" | "title"
>;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    console.log('Actions:', actions);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    if (typeof actions?.onClick === 'function') {
      this.container.addEventListener("click", (e) => {
        console.log('Клик по карточке:', e.target);
        actions.onClick();
      });
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const [key, className] of Object.entries(categoryMap) as [
      keyof typeof categoryMap,
      string
    ][]) {
      this.categoryElement.classList.toggle(className, key === value);
    }
  }

  set image(value: string) {
    this.imageElement.src = value;
    this.imageElement.alt = this.title;
  }
}
