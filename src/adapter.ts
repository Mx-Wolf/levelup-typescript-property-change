import { createEventManager } from "./event-manager";
import { Notify, PlainRow } from "./types";

const createReducer = <T>(buffer: T) => (adaptedResult: Notify<T>, originalFieldName: keyof T) => {
  const manager = createEventManager<Notify<T>>();
  Object.defineProperty(adaptedResult, originalFieldName, {
    get: () => buffer[originalFieldName],
    set: (value) => {
      buffer[originalFieldName] = value;
      if (typeof manager !== 'undefined') {
        manager.dispatch(adaptedResult, originalFieldName);
      }
    }
  });
  Object.defineProperty(adaptedResult, `${originalFieldName}Changed`, {
    writable: false,
    value: manager.subscriptionManager
  });
  return adaptedResult;
};



// адаптер для создания обертки вокруг оригинального значения
// рассматривает каждый его ключ и добавляет в изначально пустой
// объект нужные свойства
export const wrapNotify = <T extends PlainRow>(buffer: T): Notify<T> => Object
  .keys(buffer)
  .reduce(
    createReducer(buffer),
    {} as Notify<T>,
  );