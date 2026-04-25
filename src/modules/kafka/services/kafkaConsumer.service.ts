import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';
import { KafkaClientFactory } from '../factories/kafka-client.factory';

export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private configservice: ConfigService) {
    // KafkaClientFactory is nothing but it's just defining the "kafka-server address".
    this.kafka = KafkaClientFactory.create(configservice);

    this.consumer = this.kafka.consumer({
      groupId: configservice.get<string>('', ''),
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxBytesPerPartition: 1048576, // 1MB
      retry: {
        initialRetryTime: 300,
        retries: 5,
        multiplier: 2,
        maxRetryTime: 30000,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      this.logger.log('Kafka-consumer connected successfully  🚀');

      // Please subscribe to topics
      await this.subscribeTopics();

      // Let's consume message
      await this.startConsumingMessage();
    } catch (error) {
      this.logger.warn('Consumer is failed to connect kafka');
    }
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      this.logger.log('Kafka disconnected');
    } catch (error) {
      this.logger.warn('Failed to disconnect kafka');
    }
  }

  async subscribeTopics() {
    this.consumer.subscribe({
      topic: 'create-user',
      topics: ['notification-service', 'email-service'],
      fromBeginning: false,
    });
  }

  async startConsumingMessage() {
    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = message.value?.toString();

        console.log(data, 'consume data from kafka server');
        console.log(topic, 'topic');
        console.log(partition, 'partition');
      },
    });
  }
}
