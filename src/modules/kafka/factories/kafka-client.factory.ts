import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import { getKafkaConfig } from 'src/config/kafka.config';

export class KafkaClientFactory {
  static create(configService: ConfigService): Kafka {
    const config = getKafkaConfig(configService);

    return new Kafka({
      clientId: config.clientId,
      brokers: config.brokers!,
      retry: config.retry,
    });
  }
}
