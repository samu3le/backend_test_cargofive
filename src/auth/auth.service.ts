import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashData } from '../helper/hashData';
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findUser(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async signin(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async signup(SignupDto: SignupDto): Promise<Tokens> {
        const hash = await hashData(SignupDto.password);
        return this.prisma.users.create({
            data: {
                email: SignupDto.email,
                password: hash,
            },
        });
    }

    async logout() { }
}
