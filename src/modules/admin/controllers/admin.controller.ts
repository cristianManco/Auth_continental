import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
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
  @ApiResponse({ status: 200, description: 'List of users', type: [Admin] })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'No users found' })
  async findAll(@Query() query: any): Promise<any> {
    const { page = 1, limit = 10, sort, ...filters } = query;
    return await this.service.findAllUsers(filters, sort, +page, +limit);
  }

  @Roles('admin')
  @Get(':_id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: Admin })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('_id') id: string) {
    return await this.service.findOne(id);
  }

  @Roles('admin')
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User details updated successfully',
    type: Admin,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to update user',
  })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiBody({ type: UpdateAdminDto, description: 'Updated user data' })
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.service.updateUser(userId, updateUserDto);
  }

  @Roles('admin', 'superadmin')
  @Delete('delete/:_id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({
    status: 404,
    description: 'User not found or already deleted',
  })
  async remove(@Param('_id') id: string) {
    await this.service.removeUser(id);
    return {
      message: 'User removed successfully',
    };
  }
}
