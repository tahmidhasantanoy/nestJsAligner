import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KafkaClientFactory } from '../factories/kafka-client.factory';
import { ConfigService } from '@nestjs/config';
import { timeStamp } from 'console';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private configService: ConfigService) {
    // KafkaClientFactory is nothing but it's just defining the "kafka-server address".
    this.kafka = KafkaClientFactory.create(this.configService); // Create kafka-client || It's help to connect kafka-server.

    // Instance of kafka-producer.
    this.producer = this.kafka.producer({
      maxInFlightRequests: 1, //How many request can be processed at same time.
      idempotent: true, // No duplicate message allow even if retries.
      transactionTimeout: 3000,
    });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.logger.log(`Kafka-producer is connected 🚀`);
    } catch (error: any) {
      this.logger.error('Producer is failed to connect Kafka producer', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      this.logger.log(`Kafka is disconnected`);
    } catch (error: any) {
      this.logger.error('Failed to connect Kafka producer', error);
      throw error;
    }
  }

  async publishEvent(userInfo: any): Promise<void> {
    console.log(userInfo, 'userInfo');

    let topicName: string;
    if (userInfo?.role == 'USER') {
      topicName = 'create-user';
    } else {
      topicName = 'alternative';
    }

    this.producer.send({
      topic: topicName,
      messages: [
        {
          key: userInfo?.id,
          value: JSON.stringify(userInfo),
          timestamp: new Date().getTime().toString(),
        },
      ],
    });

    this.logger.log('kafka producer send value to kafka-server');
  }
}
