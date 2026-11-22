import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, type Producer } from 'kafkajs';

export interface OrderEvent {
  eventType: string;
  orderId: string;
}

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly producer: Producer;

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

    const kafka = new Kafka({
      clientId: 'sf-api',
      brokers,
    });

    this.producer = kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }

  async publishOrderEvent(event: OrderEvent): Promise<void> {
    await this.producer.send({
      topic: 'sf.order-events',
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify(event),
        },
      ],
    });
  }
}
