// Ограничим себя "простыми" плоскими объектами
export type PlainRow = Record<string, number | boolean | string | null | undefined>;
// Будем требовать от обработчиков событий соответствия
// этому интерфейсу
export interface PropertyChangedHandler<T> {
  // контекст - это объект, свойство которого изменилось
  // property - это имя свойства, которое изменилось
  (context: T, property: keyof T): void;
}

// Обозначим для себя тип действия
interface CancelSubscription {
  (): void;
}

// Наша цель - для каждого "простого" свойства
// простого объекта предоставить программе возможность
// подписать процедуру для получения уведомления
// Определим интерфейс для оформления и отказа
// от подсписки
export interface PropertyChangedEvent<T>{
  subscribe:(handler:PropertyChangedHandler<T>)=>CancelSubscription;
  unsubscribe:(handler: PropertyChangedHandler<T>)=>void;
}

// Мы создадим код для генерации экземпляров
// менеджеров событий
// Для каждого наблюдаемого свойства мы подготовим
// экземпляр с таким интерфейсом
export interface EventManager<T> {
  subscriptionManager: PropertyChangedEvent<T>;
  dispatch: PropertyChangedHandler<T>
}

// Воспользуемся возможностями TypeScript
// и создадим производный тип
// все свойства которого заменим на события
// т.е.
// {prop:number} --> {propChanged: ...для подписки на события}
type WithPropertyChangeEvents<T> = {
  [K in keyof T as `${K&string}Changed`]:PropertyChangedEvent<T & WithPropertyChangeEvents<T>>;
};

// тогда тип обернутого значения
// можно выразить объединением
// его оригинального типа, дополненного свойствами-событиями
export type Notify<T> = T & WithPropertyChangeEvents<T>;
