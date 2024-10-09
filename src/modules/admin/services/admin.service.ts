import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Admin, UserDocument } from '../entities/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from '../dtos/exports';
import { HashService } from 'src/Libs/shared-modules/encript/encript.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private model: Model<UserDocument>,
    private readonly hashService: HashService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      await this.validateEmail(createAdminDto.email);

      // const hashedPassword = await this.hashService.hashing(
      //   createAdminDto.password,
      // );
      const newAdmin = new this.model({
        ...createAdminDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await newAdmin.save();
    } catch (error) {
      throw new HttpException(
        'Failed to create admin: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllUsers(
    filters: any,
    sort?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const query = { deletedAt: null }; // Exclude soft-deleted users

    if (filters.name) {
      query['name'] = { $regex: filters.name, $options: 'i' };
    }
    if (filters.email) {
      query['email'] = { $regex: filters.email, $options: 'i' };
    }

    const sortOption = sort === 'asc' ? 'createdAt' : '-createdAt';
    try {
      const users = await this.model
        .find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.model.countDocuments(query).exec();

      return { users, total, page, limit };
    } catch (error) {
      throw new HttpException(
        'Failed to find users' + error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateAdminDto,
  ): Promise<Admin> {
    const user = await this.model.findOne({ _id: userId });
    if (!user) throw new NotFoundException('User not found');

    try {
      Object.assign(user, updateUserDto, { updatedAt: new Date() });
      return await user.save();
    } catch (error) {
      throw new HttpException(
        'Failed to update user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateEmail(email: string): Promise<void> {
    try {
      const user = await this.model.findOne({ email: email });
      if (user) {
        throw new HttpException(
          'Email already exists! Try again',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Failed to validate email: ' + error.message,
        HttpStatus.CONFLICT,
      );
    }
  }

  async findOneByEmail(email: string): Promise<Admin> {
    const user = await this.model.findOne({ email: email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOne(id: string): Promise<Admin> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    const user = await this.model.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const updatedAdmin = await this.model
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
    if (!updatedAdmin) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedAdmin;
  }

  async removeUser(userId: string): Promise<void> {
    const user = await this.model.findOne({ _id: userId });
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or already deleted');
    }

    try {
      user.deletedAt = new Date();
      await user.save();
    } catch (error) {
      throw new HttpException(
        'Error when trying to delete user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
