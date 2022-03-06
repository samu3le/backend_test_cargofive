import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashData } from '../helper/hashData';
import { Tokens } from './types';
import { jwtConstants } from './constants';

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

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const [jwt, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: jwtConstants.secret,
                    expiresIn: 60 * 15
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: jwtConstants.secret_refresh,
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),
        ]);
        return {
            access_token: jwt,
            refresh_token: rt,
        };

    }

    async signup(SignupDto: SignupDto): Promise<Tokens> {
        const hash = await hashData(SignupDto.password);
        const newUser = await this.prisma.users.create({
            data: {
                email: SignupDto.email,
                password: hash,
            },
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(userId: number, refreshToken: string) {
        const hash = await hashData(refreshToken);
        await this.prisma.users.update({
            where: { id: userId },
            data: { hashedRT: hash },
        })
    }

    async logout() { }
}
