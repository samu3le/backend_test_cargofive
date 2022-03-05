import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { Logger } from '@nestjs/common';

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
};
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({ data: createUserDto });
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
    Logger.log('info ', email);

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({ where: { id }, data: updateUserDto });
  }
}
