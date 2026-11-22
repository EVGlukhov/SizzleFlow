import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  KafkaProducerService,
  type OrderEvent,
} from './kafka/kafka-producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('events')
  async publishEvent(
    @Body() event: OrderEvent,
  ): Promise<{ published: boolean; orderId: string }> {
    await this.kafkaProducer.publishOrderEvent(event);
    return { published: true, orderId: event.orderId };
  }
}
