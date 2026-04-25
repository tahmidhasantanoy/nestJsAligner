import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import { getKafkaConfig } from 'src/config/kafka.config';

// KafkaClientFactory is nothing but it's just defining the "kafka-server address".
export class KafkaClientFactory {
  static create(configService: ConfigService): Kafka {
    const config = getKafkaConfig(configService);

    return new Kafka({
      clientId: config.clientId, 
      // It's mainly userName of this app. It's helpful for - logging,monitoring,debugging 
      brokers: config.brokers!,
      retry: config.retry,
    });
  }
}
