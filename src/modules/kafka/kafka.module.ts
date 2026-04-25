import { Module } from '@nestjs/common';
import { KafkaProducerService } from './services/kafkaProducer.service';
import { KafkaController } from './kafka.controller';

@Module({
  controllers: [KafkaController],
  providers: [KafkaProducerService],
  exports:[KafkaProducerService]
})
export class KafkaModule {}
