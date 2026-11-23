import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import type { OrderEvent } from './kafka/order-event';

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
  ): Promise<{ published: boolean; orderId: string; eventId: string }> {
    const eventId = await this.kafkaProducer.publishOrderEvent(event);
    return { published: true, orderId: event.orderId, eventId };
  }
}
