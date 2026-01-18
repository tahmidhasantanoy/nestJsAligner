import { ConfigService } from '@nestjs/config';

export default () => ({
  database: {
    db_url: process.env.DB_URL,
  },
});

export const getDatabaseConfig = (configService: ConfigService) => {
  return {
    uri: configService.get<string>('agenda.uri'),
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  };
};
