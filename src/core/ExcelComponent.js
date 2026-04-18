import { DOMListener } from "@core/DOMListener";

export class ExcelComponent extends DOMListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || "";
    this.emitter = options.emitter;
    this.subscribe = options.subscribe || [];
    this.store = options.store;
    this.unsubscribers = [];

    this.prepare();
  }

  // настраиваем наш компонент до init
  prepare() {}

  // возвращает шаблон компонента
  toHTML() {
    return "";
  }

  // уведомляем слушателей про события event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }

  // подписывемся на события event
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsub);
  }

  $dispatch(action) {
    this.store.dispatch(action);
  }

  // сюда приходят только изменения по тем полям, на которые мы подписались
  storeChanged() {}

  isWatching(key) {
    return this.subscribe.includes(key);
  }

  // инициализируем компонент
  // добавляем DOM слушателей
  init() {
    this.initDOMListeners();
  }

  // удаляет компонент
  // чистим слушатели
  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach((unsub) => unsub());
  }
}
