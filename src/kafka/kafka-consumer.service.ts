import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { isOrderEvent } from './order-event';
import { createKafkaClient } from './kafka-client';
import { KAFKA_TOPICS, ORDER_EVENT_TYPES } from './kafka.constants';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly consumer: Consumer;

  constructor() {
    const kafka = createKafkaClient('sf-kitchen');
    this.consumer = kafka.consumer({ groupId: 'sf-kitchen' });
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPICS.ORDER_EVENTS,
      fromBeginning: true,
    });

    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        const rawValue = message.value?.toString();

        if (rawValue === undefined) {
          throw new Error(
            `Missing event value at ${topic}[${partition}] offset=${message.offset}`,
          );
        }

        const event: unknown = JSON.parse(rawValue);

        if (!isOrderEvent(event)) {
          throw new Error(
            `Invalid order event at ${topic}[${partition}] offset=${message.offset}`,
          );
        }

        if (event.eventType === ORDER_EVENT_TYPES.PAYMENT_CONFIRMED) {
          this.logger.log(`Kitchen starts preparing order ${event.orderId}`);
        }

        await this.consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (BigInt(message.offset) + 1n).toString(),
          },
        ]);
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
