import { Controller, Put, Delete, Body, Param, Logger, NotFoundException, InternalServerErrorException, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/services';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida con éxito' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getAllUsers() {
    const source = 'UserController -> getAllUsers()';

    this.logger.log({
      message: '[REQ] GET /user - getAllUsers()',
      source,
    });

    try {
      const response = await this.userService.getAllUsers();

      this.logger.log({
        message: '[RES] GET /user - getAllUsers()',
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: '[ERR] GET /user - getAllUsers()',
        error,
        source,
      });
      throw new InternalServerErrorException('Error al obtener usuarios');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getUserById(@Param('id') id: string) {
    const source = 'UserController -> getUserById()';

    this.logger.log({
      message: `[REQ] GET /user/${id} - getUserById()`,
      source,
      id,
    });

    try {
      const response = await this.userService.getUserById(id);

      this.logger.log({
        message: `[RES] GET /user/${id} - getUserById()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] GET /user/${id} - getUserById()`,
        error,
        source,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener usuario');
    }
  }

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
