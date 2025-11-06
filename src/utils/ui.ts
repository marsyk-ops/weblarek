export function cloneTemplate<T extends HTMLElement = HTMLElement>(id: string): T {
  const tpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tpl) throw new Error(`Не найден template#${id}`);
  return tpl.content.firstElementChild!.cloneNode(true) as T;
}

export function ensure<T extends Element>(el: T | null, msg: string): T {
  if (!el) throw new Error(msg);
  return el;
}

export function setDisabled(btn: HTMLButtonElement, disabled: boolean) {
  btn.toggleAttribute('disabled', disabled);
}