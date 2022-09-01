import { parse } from 'css-what';

export type CustomEventMap = {
  [key: string]: any[];
};
type Listener<
  M,
  K extends string = string
> = K extends keyof GlobalEventHandlersEventMap
  ? (event: GlobalEventHandlersEventMap[K]) => any
  : K extends keyof M
  ? (event: CustomEvent<M[K]>) => any
  : EventListener;
type ListenerKeys<T> = keyof T extends string ? keyof T : never;
type ListenerOptions = boolean | AddEventListenerOptions;

export const addClass = (element: HTMLElement, ...classes: string[]) =>
  element.classList.add(...classes);

export const emit = (target: EventTarget, event: Event): boolean =>
  target.dispatchEvent(event);

export const emitCustom = <T extends any[] = any[]>(
  target: EventTarget,
  eventName: string,
  ...params: T
): boolean =>
  emit(
    target,
    new CustomEvent<T>(eventName, {
      detail: params,
    })
  );

export const empty = (element: HTMLElement): void => {
  while (element.hasChildNodes()) {
    element.firstChild?.remove();
  }
};

export const h = <T extends HTMLElement = HTMLElement>(
  selector: string,
  ...childNodes: (Node | Element)[]
): T => {
  const [element] = parse(selector).map((selectors) =>
    selectors.reduce((element: HTMLElement, details) => {
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
    }, document.createElement('div'))
  );

  childNodes.forEach((childNode) => {
    if (childNode instanceof Element) {
      childNode = childNode.element();
    }

    element.append(childNode);
  });

  return element as T;
};

export const hasClass = (element: HTMLElement, className: string): boolean =>
  element.classList.contains(className);

export const off = <
  M extends CustomEventMap = CustomEventMap,
  K extends
    | string
    | ListenerKeys<GlobalEventHandlersEventMap>
    | ListenerKeys<M> = string
>(
  target: EventTarget,
  event: K,
  listener: Listener<M, K>,
  options: ListenerOptions = {}
): void =>
  target.removeEventListener(
    event as string,
    listener as EventListener,
    options
  );

export const on = <
  M extends CustomEventMap = CustomEventMap,
  K extends
    | string
    | ListenerKeys<GlobalEventHandlersEventMap>
    | ListenerKeys<M> = string
>(
  target: EventTarget,
  event: K,
  listener: Listener<M, K>,
  options: ListenerOptions = {}
): void =>
  target.addEventListener(event as string, listener as EventListener, options);

export const once = <
  M extends CustomEventMap = CustomEventMap,
  K extends
    | string
    | ListenerKeys<GlobalEventHandlersEventMap>
    | ListenerKeys<M> = string
>(
  target: EventTarget,
  event: K,
  listener: Listener<M, K>,
  options: ListenerOptions = {}
): void =>
  on<M, K>(target, event, listener, {
    ...(typeof options === 'boolean' ? { capture: options } : options),
    once: true,
  });

export const onEach = <
  M extends CustomEventMap = CustomEventMap,
  K extends
    | string
    | ListenerKeys<GlobalEventHandlersEventMap>
    | ListenerKeys<M> = string
>(
  target: EventTarget,
  events: K[],
  listener: Listener<M, K>,
  options: ListenerOptions = {}
): void =>
  events.forEach((event) => on<M, K>(target, event, listener, options));

export const removeClass = (element: HTMLElement, ...classes: string[]) =>
  element.classList.remove(...classes);

export const s = <T extends HTMLElement = HTMLElement>(html: string): T => {
  const container = document.createElement('div');

  container.innerHTML = html;

  return container.firstElementChild as T;
};

export const t = (content: string): Text => document.createTextNode(content);

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
    addClass(this.element(), ...classes);
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

  emitCustom<K extends string | keyof M>(
    eventName: K,
    ...params: M[K]
  ): boolean {
    return emitCustom<M[K]>(this.element(), eventName as string, ...params);
  }

  empty(): void {
    empty(this.element());
  }

  hasClass(className: string): boolean {
    return hasClass(this.element(), className);
  }

  on<
    K extends string =
      | ListenerKeys<GlobalEventHandlersEventMap>
      | ListenerKeys<M>
  >(event: K, listener: Listener<M, K>, options: ListenerOptions = {}): void {
    on<M, K>(this.element(), event, listener, options);
  }

  off<
    K extends string =
      | ListenerKeys<GlobalEventHandlersEventMap>
      | ListenerKeys<M>
  >(event: K, listener: Listener<M, K>, options: ListenerOptions = {}): void {
    off<M, K>(this.element(), event, listener, options);
  }

  once<K extends string = ListenerKeys<GlobalEventHandlersEventMap & M>>(
    event: K,
    listener: Listener<M, K>,
    options: ListenerOptions = {}
  ): void {
    once<M, K>(this.element(), event, listener, options);
  }

  onEach<K extends string = ListenerKeys<GlobalEventHandlersEventMap & M>>(
    events: K[],
    listener: Listener<M, K>,
    options: ListenerOptions = {}
  ): void {
    onEach<M, K>(this.element(), events, listener, options);
  }

  query<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.element().querySelector<T>(selector);
  }

  queryAll<T extends HTMLElement = HTMLElement>(
    selector: string
  ): NodeListOf<T> {
    return this.element().querySelectorAll<T>(selector);
  }

  removeClass(...classes: string[]): void {
    removeClass(this.element(), ...classes);
  }
}

export default Element;
