import { parse } from 'css-what';

export const emit = (element: EventTarget, event: Event): boolean =>
  element.dispatchEvent(event);

export const emitCustom = <T extends any[] = any[]>(
  element: EventTarget,
  eventName: string,
  ...params: T
): boolean =>
  emit(
    element,
    new CustomEvent<T>(eventName, {
      detail: params,
    })
  );

export const empty = (element: HTMLElement): void => {
  while (element.hasChildNodes()) {
    element.firstChild.remove();
  }
};

export const h = <T extends HTMLElement = HTMLElement>(
  selector: string,
  ...childNodes: (Node | Element)[]
): T => {
  const [element] = parse(selector).map((selectors) =>
    selectors.reduce((element: HTMLElement | null, details) => {
      if (element === null && details.type !== 'tag') {
        element = document.createElement('div');
      }

      if (details.type === 'tag') {
        return document.createElement(details.name);
      }

      if (details.type === 'attribute' && details.name !== 'class') {
        element.setAttribute(details.name, details.value ?? '');
      }

      if (details.type === 'attribute' && details.name === 'class') {
        element.classList.add(details.value);
      }

      return element;
    }, null)
  );

  childNodes.forEach((childNode) => {
    if (childNode instanceof Element) {
      childNode = childNode.element();
    }

    element.append(childNode);
  });

  return element as T;
};

export const on:
  | (<K extends keyof GlobalEventHandlersEventMap>(
      target: EventTarget,
      event: K,
      listener: (event: GlobalEventHandlersEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ) => any)
  | ((
      element: EventTarget,
      event: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => any) = (target, event, handler, options): void =>
  target.addEventListener(event, handler, options);

export const once:
  | (<K extends keyof GlobalEventHandlersEventMap>(
      target: EventTarget,
      event: K,
      listener: (event: GlobalEventHandlersEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ) => any)
  | ((
      element: EventTarget,
      event: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => any) = (target, event, handler, options): void =>
  on(event, handler, { ...options, once: true });

export const onEach:
  | (<K extends keyof GlobalEventHandlersEventMap>(
      target: EventTarget,
      events: K[],
      listener: (event: GlobalEventHandlersEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ) => any)
  | ((
      target: EventTarget,
      events: string[],
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => any) = (target, events, handler, options): any => {
  events.forEach((event) => on(target, event, handler, options));
};

export const s = <T extends HTMLElement = HTMLElement>(html: string): T => {
  const container = document.createElement('div');

  container.innerHTML = html;

  return container.firstElementChild as T;
};

export const t = (content: string): Text => document.createTextNode(content);

type CustomEventMap = {
  [key: string]: any[];
};

export class Element<
  T extends HTMLElement = HTMLElement,
  M extends CustomEventMap = CustomEventMap
> {
  #element: T;

  constructor(element: T) {
    this.#element = element;
  }

  static fromSelector<
    T extends HTMLElement = HTMLElement,
    M extends CustomEventMap = CustomEventMap
  >(selector: string, ...childNodes: Node[]): Element<T, M> {
    return new Element(h(selector, ...childNodes));
  }

  static fromString<
    T extends HTMLElement = HTMLElement,
    M extends CustomEventMap = CustomEventMap
  >(html: string): Element<T, M> {
    return new Element(s(html));
  }

  addClass(...classes: string[]): void {
    this.element().classList.add(...classes);
  }

  append(...nodes: (Node | Element)[]): void {
    nodes.forEach((node) => {
      if (node instanceof Element) {
        node = node.element();
      }

      this.element().append(node);
    });
  }

  element(): T {
    return this.#element;
  }

  emit(event: Event): boolean {
    return emit(this.element(), event);
  }

  emitCustom<T extends any[] = any[]>(
    eventName: string,
    ...params: T
  ): boolean {
    return emitCustom<T>(this.element(), eventName, ...params);
  }

  empty(): void {
    empty(this.element());
  }

  on<K extends keyof GlobalEventHandlersEventMap>(
    event: K,
    listener: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  on<K extends keyof M>(
    event: K,
    listener: (event: CustomEvent<M[K]>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  on(
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  on(event, handler, options): void {
    on(this.element(), event, handler, options);
  }

  once<K extends keyof GlobalEventHandlersEventMap>(
    event: K,
    listener: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  once<K extends keyof M>(
    event: K,
    listener: (event: CustomEvent<M[K]>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  once(
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  once(event, handler, options): void {
    once(this.element(), event, handler, options);
  }

  onEach<K extends keyof GlobalEventHandlersEventMap>(
    events: K[],
    listener: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  onEach<K extends keyof M>(
    events: K[],
    listener: (event: CustomEvent<M[K]>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  onEach(
    events: string[],
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  onEach(events, handler, options): void {
    onEach(this.element(), events, handler, options);
  }

  removeClass(...classes: string[]): void {
    this.element().classList.remove(...classes);
  }
}

export default Element;
