import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KafkaProducerService } from './services/kafkaProducer.service';
import { CreateKafkaDto } from './dto/create-kafka.dto';
import { UpdateKafkaDto } from './dto/update-kafka.dto';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaProducerService) {}
}
