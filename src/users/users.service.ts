import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { Logger } from '@nestjs/common';
import { UserDeactiveException } from './exceptions/userDeactive.exception';
import { hashData } from '../helper/hashData';

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  is_active: boolean;
};
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {

    const hash = await hashData(createUserDto.password);
    await this.prisma.users.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hash,
      },
    });

    return {
      user: {
        email: createUserDto.email,
        name: createUserDto.name,
      },
    };
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = this.prisma.users.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findUser(email: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new UserNotFoundException();
    }
    if (!user.is_active) {
      throw new UserDeactiveException();
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id: updateUserDto.id },
      data: {
        email: updateUserDto?.email,
        name: updateUserDto?.name,
        password: updateUserDto?.password,
        is_active: updateUserDto?.is_active,
      },
    });
  }
}
