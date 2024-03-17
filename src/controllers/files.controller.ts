import {
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';

@Controller('files')
export class FilesController {
  constructor(
    private readonly logger: Logger = new Logger(FilesController.name),
  ) {}

  @Post('buyOrder')
  async createBuyOrder(
    // TODO: remove anys
    @Body() body: any,
  ): Promise<any> {
    const source = 'FilesController -> createBuyOrder()';

    try {
      this.logger.log({
        message: '[REQ] POST /buyOrder - createBuyOrder()',
        source,
        body,
      });

      //exec

      this.logger.log({
        message: '[RES] POST /buyOrder - createBuyOrder()',
        // response,
        body,
        source,
      });

      // return response;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }
}