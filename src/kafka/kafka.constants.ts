export const KAFKA_BROKERS_ENV = 'KAFKA_BROKERS';

export const KAFKA_TOPICS = {
  ORDER_EVENTS: 'sf.order-events',
} as const;

export const ORDER_EVENT_TYPES = {
  ORDER_CREATED: 'OrderCreated',
  PAYMENT_CONFIRMED: 'PaymentConfirmed',
  KITCHEN_PREPARATION_STARTED: 'KitchenPreparationStarted',
  ORDER_READY: 'OrderReady',
} as const;

export type OrderEventType =
  (typeof ORDER_EVENT_TYPES)[keyof typeof ORDER_EVENT_TYPES];
