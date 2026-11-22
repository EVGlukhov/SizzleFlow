import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KafkaProducerService, KafkaConsumerService],
})
export class AppModule {}
