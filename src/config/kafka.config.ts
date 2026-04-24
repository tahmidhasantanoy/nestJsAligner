import { ConfigService } from '@nestjs/config';

export const getKafkaConfig = (configService: ConfigService) => {
  const broker = configService.get<string>('KAFKA_BROKER');

  if (!broker) {
    throw new Error('KAFKA_BROKER environment variable is required');
  }

  return {
    clientId: configService.get<string>('KAFKA_CLIENT_ID'),
    // brokers: configService.get<string[]>('KAFKA_BROKER'),
    brokers: [broker],
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
  };
};
