import { ORDER_EVENT_TYPES, type OrderEventType } from './kafka.constants';

export interface OrderEvent {
  eventId?: string;
  eventType: OrderEventType;
  orderId: string;
}

function isOrderEventType(value: unknown): value is OrderEventType {
  return (
    typeof value === 'string' &&
    Object.values(ORDER_EVENT_TYPES).some((eventType) => eventType === value)
  );
}

export function isOrderEvent(value: unknown): value is OrderEvent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'eventType' in value &&
    isOrderEventType(value.eventType) &&
    'orderId' in value &&
    typeof value.orderId === 'string' &&
    (!('eventId' in value) ||
      (typeof value.eventId === 'string' && value.eventId.length > 0))
  );
}
