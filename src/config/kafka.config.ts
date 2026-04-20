import { ConfigService } from '@nestjs/config';

export const getKafkaConfig = (configService: ConfigService) => ({
  clientId: configService.get<string>('kafka.clientId'),
  brokers: configService.get<string[]>('kafka.brokers'),
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});
