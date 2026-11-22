import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly consumer: Consumer;

  constructor() {
    const brokerList = process.env.KAFKA_BROKERS;
    if (!brokerList) {
      throw new Error('KAFKA_BROKERS must be configured');
    }

    const brokers = brokerList
      .split(',')
      .map((broker) => broker.trim())
      .filter(Boolean);

    if (brokers.length === 0) {
      throw new Error('KAFKA_BROKERS must contain at least one broker');
    }

    const kafka = new Kafka({ clientId: 'sf-kitchen', brokers });
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
        this.logger.log(
          `${topic}[${partition}] offset=${message.offset} key=${message.key?.toString() ?? 'null'} value=${message.value?.toString() ?? 'null'}`,
        );
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
