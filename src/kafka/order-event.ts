import { ORDER_EVENT_TYPES, OrderEventType } from './kafka.constants';

export interface OrderEvent {
  eventType: string;
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
    typeof value.eventType === 'string' &&
    'orderId' in value &&
    typeof value.orderId === 'string'
  );
}
