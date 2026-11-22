import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { isOrderEvent } from './order-event';
import { createKafkaClient } from './kafka-client';

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
      topic: 'sf.order-events',
      fromBeginning: true,
    });

    await this.consumer.run({
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
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
