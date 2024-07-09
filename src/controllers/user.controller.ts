import { Controller, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/services';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Put(':username/selectedDate')
  async updateSelectedDate(
    @Param('username') username: string,
    @Body('selectedDate') selectedDate: string,
  ) {
    const source = 'UserController -> updateSelectedDate()';

    this.logger.log({
      message: `[REQ] PUT /user/${username}/selectedDate - updateSelectedDate()`,
      source,
      username,
      selectedDate,
    });

    const response = await this.userService.updateSelectedDate(username, selectedDate);

    this.logger.log({
      message: `[RES] PUT /user/${username}/selectedDate - updateSelectedDate()`,
      response,
      source,
    });

    return response;
  }

  @Delete(':username/selectedDate')
  async deleteSelectedDate(@Param('username') username: string) {
    const source = 'UserController -> deleteSelectedDate()';

    this.logger.log({
      message: `[REQ] DELETE /user/${username}/selectedDate - deleteSelectedDate()`,
      source,
      username,
    });

    const response = await this.userService.deleteSelectedDate(username);

    this.logger.log({
      message: `[RES] DELETE /user/${username}/selectedDate - deleteSelectedDate()`,
      response,
      source,
    });

    return response;
  }
}
