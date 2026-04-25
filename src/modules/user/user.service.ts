import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './Schemas/user.schema';
import { createUserDto } from './Dto/user-dto';
import { KafkaProducerService } from '../kafka/services/kafkaProducer.service';
// import { UserV2 } from 'src/auth/schemas/auth.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  async findOne(userInfo: { email: string }) {
    try {
      const resFromDB = await this.userModel.findOne({ email: userInfo.email });
      return resFromDB;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findAll() {
    const resFromDB = await this.userModel.find();
    return resFromDB;
  }

  async createUser(createUser: any) {
    try {
      const { email, fullName, password, role, X } = createUser;

      const userInfo = {
        id:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        email,
        fullName,
        password,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        X: X ?? null,
      };

      // Validate input data
      if (!createUser.email || !createUser.fullName) {
        throw new Error('Email and fullName are required');
      }
      // if (userInfo.X === null) {
      //   throw new Error('X is required');
      // }

      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        email: createUser.email,
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = new this.userModel(userInfo);

      await this.kafkaProducerService.publishEvent(newUser)
      return await newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateData: { fullName?: string; email?: string },
  ) {
    const isExist = await this.userModel.findOne({ id: id });

    if (!isExist) return 'User not found';

    const update = await this.userModel.findOneAndUpdate(
      { id: isExist.id },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );
    return update;
  }
}
