import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { type Producer } from 'kafkajs';
import type { OrderEvent } from './order-event';
import { createKafkaClient } from './kafka-client';
import { KAFKA_TOPICS } from './kafka.constants';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly producer: Producer;

  constructor() {
    const kafka = createKafkaClient('sf-api');
    this.producer = kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }

  async publishOrderEvent(event: OrderEvent): Promise<string> {
    if (event.eventId !== undefined && event.eventId.trim() === '') {
      throw new Error('eventId must not be empty');
    }

    const eventId = event.eventId ?? randomUUID();

    await this.producer.send({
      topic: KAFKA_TOPICS.ORDER_EVENTS,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({ ...event, eventId }),
        },
      ],
    });

    return eventId;
  }
}
