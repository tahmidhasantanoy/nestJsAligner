import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateKafkaDto } from './dto/create-kafka.dto';
import { UpdateKafkaDto } from './dto/update-kafka.dto';
import { Kafka, Producer } from 'kafkajs';
import { KafkaClientFactory } from './factories/kafka-client.factory';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private logger: Logger;

  constructor(private configService: ConfigService) {
    this.kafka = KafkaClientFactory.create(this.configService); // Create kafka-client || It's help to connect kafka-server.

    // Instance of kafka-producer.
    this.producer = this.kafka.producer({
      maxInFlightRequests: 1, //How many request can be processed at same time.
      idempotent: true, // No duplicate message allow even if retries.
      transactionTimeout: 3000,
    });
  }

  onModuleInit() {
    try {
      this.producer.connect();
      this.logger.log(`Kafka is connected`);
    } catch (error: any) {
      this.logger.error('Failed to connect Kafka producer', error);
      throw error;
    }
  }

  onModuleDestroy() {
    try {
      this.producer.disconnect();
      this.logger.log(`Kafka is disconnected`);
    } catch (error: any) {
      this.logger.error('Failed to connect Kafka producer', error);
      throw error;
    }
  }
}
