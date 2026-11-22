import { Kafka } from 'kafkajs';
import { KAFKA_BROKERS_ENV } from './kafka.constants';

export function createKafkaClient(clientId: string): Kafka {
  const brokerList = process.env[KAFKA_BROKERS_ENV];

  if (!brokerList) {
    throw new Error(`${KAFKA_BROKERS_ENV} must be configured`);
  }

  const brokers = brokerList
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean);

  if (brokers.length === 0) {
    throw new Error(`${KAFKA_BROKERS_ENV} must contain at least one broker`);
  }

  return new Kafka({ clientId, brokers });
}
