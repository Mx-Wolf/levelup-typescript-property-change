import { EventManager, PropertyChangedHandler } from './types';

export const createEventManager = <T>(): EventManager<T> => {

  // подготовим буфер для хранения ссылок на всех подписчиков
  const handlers = new Set<PropertyChangedHandler<T>>();

  // подготовим функцию для отмены подписки
  const unsubscribe = (handler: PropertyChangedHandler<T>) => {
    handlers.delete(handler);
  };
  return {
    // функция доставки уведомлений
    // вызывает всех подписчиков
    // в общем-то мы не гарантируем порядок
    // кто первый подписался, того первого вызовем
    dispatch: (context, property) => {
      handlers.forEach((handler) => handler(context, property));
    },
    subscriptionManager: {
      // функция оформления подписки
      // регистрирует функцию-обработчик
      // в буфере
      // и возвращает функцию-ярлык для отмены подписки
      subscribe: (handler) => {
        handlers.add(handler);
        return () => unsubscribe(handler);
      },
      // Подписку можно отменить и без ярлыка
      // зная обработчик
      unsubscribe,
    }
  };
};
