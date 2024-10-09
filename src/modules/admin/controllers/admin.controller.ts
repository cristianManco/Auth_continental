import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { UpdateAdminDto } from '../dtos/exports';
import { Admin } from '../entities/admin.entity';
import { Roles } from 'src/Libs/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Roles('admin', 'superadmin')
  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by name',
    type: String,
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email',
    type: String,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort order (asc or desc)',
    enum: ['asc', 'desc'],
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [Admin] })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'No se encontraron usuarios' })
  async findAll(@Query() query: any): Promise<any> {
    const { page = 1, limit = 10, sort, ...filters } = query;
    return await this.service.findAllUsers(filters, sort, +page, +limit);
  }

  @Roles('admin')
  @Get(':_id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: Admin })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('_id') id: string) {
    return await this.service.findOne(id);
  }

  @Roles('admin')
  @Put(':_id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: Admin })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('_id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return await this.service.update(id, updateAdminDto);
  }

  @Roles('admin')
  @Delete(':_id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado o ya eliminado',
  })
  async remove(@Param('_id') id: string) {
    await this.service.removeUser(id);
    return {
      message: 'User removed successfully',
    };
  }
}
