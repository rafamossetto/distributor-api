import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findOne(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = await new this.userModel(user).save();
    delete newUser.password;
    return newUser;
  }

  changePassword(username: string, password: string) {
    return this.userModel
      .findOneAndUpdate(
        { username },
        {
          password,
        },
      )
      .exec();
  }
}
