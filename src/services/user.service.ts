import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<UserDocument> {
    const source = 'UserService -> findOne()';

    this.logger.log({
      message: `[REQ] findOne ${username}`,
      source,
    });

    try {
      const response = await this.userModel.findOne({ username }).exec();
      this.logger.log({
        message: `[RES] findOne ${username}`,
        response,
        source,
      });
      return response;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    const source = 'UserService -> create()';

    this.logger.log({
      message: `[REQ] create user ${user.username}`,
      source,
    });

    try {
      const newUser = await new this.userModel(user).save();
      delete newUser.password;

      this.logger.log({
        message: `[RES] create user ${user.username}`,
        response: newUser,
        source,
      });

      return newUser;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async changePassword(username: string, password: string) {
    const source = 'UserService -> changePassword()';

    this.logger.log({
      message: `[REQ] changePassword ${username}`,
      source,
    });

    try {
      const response = await this.userModel
        .findOneAndUpdate({ username }, { password })
        .exec();

      this.logger.log({
        message: `[RES] changePassword ${username}`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async updateSelectedDate(username: string, selectedDate: string): Promise<UserDocument> {
    const source = 'UserService -> updateSelectedDate()';

    this.logger.log({
      message: `[REQ] updateSelectedDate ${username}`,
      source,
    });

    try {
      const response = await this.userModel
        .findOneAndUpdate({ username }, { selectedDate }, { new: true })
        .exec();

      this.logger.log({
        message: `[RES] updateSelectedDate ${username}`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async deleteSelectedDate(username: string): Promise<UserDocument> {
    const source = 'UserService -> deleteSelectedDate()';

    this.logger.log({
      message: `[REQ] deleteSelectedDate ${username}`,
      source,
    });

    try {
      const response = await this.userModel
        .findOneAndUpdate({ username }, { $unset: { selectedDate: "" } }, { new: true })
        .exec();

      this.logger.log({
        message: `[RES] deleteSelectedDate ${username}`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }
}
